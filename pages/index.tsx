import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Next.js v12.2+ Router bug demo</title>
        <meta name="description" content="Next.js v12.2+ Router bug demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section>
        <h1>Next.js v12.2+ router bug demo</h1>
        <p>This is an app to demo the Next.js router bug.</p>
        <p>Fixed in version next@12.3.2-canary.25.</p>
        <p>
          Open the browser console and navigate to <a href="/nieuws">/nieuws</a>{" "}
          to see the error.
        </p>
      </section>
      <section>
        <h2>Code:</h2>
        <blockquote>/pages/nieuws/overview/[...overview].tsx</blockquote>
        <textarea
          readOnly={true}
          style={{ width: "100%" }}
          rows={10}
          defaultValue={`
import type {
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";
import Link from "next/link";

interface Props {
  page: number;
}

function Page(props: Props) {
  const previous = props?.page - 1;
  const next = props?.page + 1;
  return (
    <>
      <h1>Test page {props.page}</h1>
      <nav>
        {previous > 0 && (
          <Link href={\`/nieuws?page=\${previous}\`} passHref={true}>
            <a style={{ marginRight: "1rem" }}>Page {previous}</a>
          </Link>
        )}
        <Link href={\`/nieuws?page=\${next}\`} passHref={true}>
          <a>Page {next}</a>
        </Link>
      </nav>
    </>
  );
}

export async function getStaticProps(
  ctx: GetStaticPropsContext
): Promise<ReturnType<GetStaticProps>> {
  return {
    props: {
      page: ctx.params?.overview
        ? parseInt(ctx.params?.overview as string, 10)
        : 1,
    },
  };
}

export async function getStaticPaths(): Promise<ReturnType<GetStaticPaths>> {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Page;
`}
        />
      </section>
      <section>
        <h2>Code:</h2>
        <blockquote>/middleware.ts</blockquote>
        <textarea
          readOnly={true}
          style={{ width: "100%" }}
          rows={10}
          defaultValue={`
import { NextRequest, NextResponse } from "next/server";

const rewrites = [
  {
    source: /^\/nieuws$/,
    destination: "/nieuws/overview/1",
  },
  {
    source: /^\/nieuws\?page=(?<pageNr>\d+)/gi,
    destination: "/nieuws/overview/$<pageNr>",
  },
];

/**
 * Returns the rewritten URL if it matches any rewrites. Otherwise returns \`null\`.
 * @param req
 * @returns
 */
function getRewriteUrl(req: NextRequest): string | null {
  const protocol = req.nextUrl.protocol;
  const host = req.headers.get("host");
  const search = req.nextUrl.search;
  const pathname = req.nextUrl.pathname;
  let rewriteUrl: string | null = null;
  for (let i = 0; i < rewrites.length; ++i) {
    if (\`\${pathname}\${search}\`.match(rewrites[i].source)) {
      const rewritten = \`\${pathname}\${search}\`.replace(
        rewrites[i].source,
        rewrites[i].destination
      );
      if (rewritten !== \`\${pathname}\${search}\`) {
        if (rewritten.indexOf("://") === -1) {
          rewriteUrl = \`\${protocol}//\${host}\${rewritten}\`;
        } else {
          rewriteUrl = rewritten;
        }
        break;
      }
    }
  }
  return rewriteUrl;
}

export function middleware(req: NextRequest) {
  const rewriteUrl = getRewriteUrl(req);
  if (rewriteUrl) {
    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}
          
        `}
        />
      </section>
    </>
  );
};

export default Home;
