import React from "react";

const Home = () => {
  const name = "Sadikshya Nepal"
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-orange-500">
        Welcome to Furever `${name}`!
      </h1>
    </div>
  );
};

export default Home;
