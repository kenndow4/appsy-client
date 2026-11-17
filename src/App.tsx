

import { TooltipProvider } from "./component/ui/tooltip";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return(
    <TooltipProvider>
      
      <AppRoutes />
    </TooltipProvider>
  )
  

}

export default App;