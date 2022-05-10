import { Plane } from 'react-loader-spinner';

function ReactLoader() {
  return (
    <div className="absolute w-full bottom-0 left-0 z-[2000] flex justify-center items-center h-screen ">
      <Plane />
    </div>
  );
}

export default ReactLoader;
