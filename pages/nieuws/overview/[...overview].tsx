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
          <Link href={`/nieuws?page=${previous}`} passHref={true}>
            <a style={{ marginRight: "1rem" }}>Page {previous}</a>
          </Link>
        )}
        <Link href={`/nieuws?page=${next}`} passHref={true}>
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
