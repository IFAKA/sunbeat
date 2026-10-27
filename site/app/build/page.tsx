import Nav from "@/components/Nav";

export const metadata = { title: "3D model · Sunbeat", description: "The real parts of the Sunbeat clip at real size. Pull it apart, hide any part." };

export default function Build() {
  return (
    <>
      <Nav />
      <iframe src="/viewer/index.html#stage=4&view=exploded" title="Sunbeat 3D model" className="fixed inset-x-0 bottom-0 top-12 h-[calc(100svh-48px)] w-full border-0" />
    </>
  );
}
