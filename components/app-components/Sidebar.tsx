import Navlist from "../shared/Navlist";

const Sidebar = () => {
  return (
    <aside className="w-72 h-screen bg-card fixed shadow-sm top-0 hidden lg:flex flex-col justify-between">
      <p className="text-2xl font-bold text-primary p-7">Quiz</p>

      <Navlist mode="desktop" />
    </aside>
  );
};

export default Sidebar;
