import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React from "react";
import { TemplateViewer } from "@/components/templates/TemplateViewer";
import { TemplatePreview, getTemplateStub } from "@/data/templates/templates.stub";

type TemplateParams = {
  category: string;
  templateId: string;
};

export const getServerSideProps: GetServerSideProps<{ template: TemplatePreview }, TemplateParams> = async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }

  const template = getTemplateStub(params.category, params.templateId);

  if (!template) {
    return { notFound: true };
  }

  return {
    props: {
      template,
    },
  };
};

export default function TemplatePreviewPage({ template }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>{`${template.title} | Template Preview`}</title>
        <meta
          name="description"
          content={`Preview ${template.title} in read-only mode. Explore structure, maths notes, and outputs without exporting or saving.`}
        />
      </Head>
      <TemplateViewer template={template} />
    </>
  );
}
