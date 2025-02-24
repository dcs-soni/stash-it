import { Card } from "@/components/Card";
import { Sidebar } from "@/components/Sidebar";
import { useContent } from "@/hooks/useContent";
import { Header } from "@/components/Header";

function Dashboard() {
  const contents = useContent();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-60">
        <Header />

        {contents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No content stashed yet. Click "Stash" to add your first item!
            </p>
          </div>
        ) : (
          <div className="pt-24 pl-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contents.map((content: any, index: number) => (
              <Card
                key={index}
                link={content.link}
                type={content.type}
                title={content.title}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
