import type { GetStaticPaths, GetStaticProps } from "next";

function Page() {
  return <h1>Test page</h1>;
}

export async function getStaticProps(): Promise<ReturnType<GetStaticProps>> {
  return {
    props: {},
  };
}

export async function getStaticPaths(): Promise<ReturnType<GetStaticPaths>> {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default Page;
