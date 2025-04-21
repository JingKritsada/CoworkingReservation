import ExploreSpaces from "@/components/ExploreSpaces";
import getSpaces from "@/libraries/spacesAPI";
import Banner from "@/components/Banner";

export default async function explorePage() {
  const spaces = await getSpaces();
  console.log(spaces);
  return (
    <main>
      <Banner />
      <div className="bg-gray min-h-screen">
        <ExploreSpaces spaceJson={spaces} />
      </div>
    </main>
  );
}
