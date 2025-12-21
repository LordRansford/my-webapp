import { GetServerSideProps } from "next";
import CertificateVerifyPage, { getServerSideProps as baseProps } from "../certificates/verify/[certificateId]";

export { CertificateVerifyPage as default };
export const getServerSideProps: GetServerSideProps = (ctx) => baseProps(ctx as any);


