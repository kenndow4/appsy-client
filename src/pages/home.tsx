import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Nav } from "@/components/navigator";

const houseFloorPlan = {
  elements: [],
  appState: {
    viewBackgroundColor: "#ffffff",
    theme: "light",
  },
};

function Home() {
  

  return (
    <>
    

      <div className="flex h-screen flex-col bg-[#f8f9fa]">

        {/* TOPBAR */}
      <Nav />

        {/* CANVAS */}

        <main className="flex-1">

          <Excalidraw initialData={houseFloorPlan} />

        </main>

        {/* FOOTER */}

        <footer className="flex h-9 items-center justify-between border-t border-gray-200 bg-white px-6">

          <div className="flex gap-4 text-xs text-gray-500">

            <span className="flex items-center gap-2">

              <div className="h-2 w-2 rounded-full bg-green-500"></div>

              Listo

            </span>

            <span>100%</span>

          </div>

          <span className="text-xs text-gray-500">
            Sketra v1.0
          </span>

        </footer>
      </div>

    
    </>
  );
}

export default Home;