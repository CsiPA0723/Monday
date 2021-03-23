import React, { useEffect, useState } from 'react';


function Home() {
  const [ username, setUsername ] = useState<string>(null);

  useEffect(() => {
    function setName(_, user) {
      setUsername(user)
    }


    return () => {
      
    }
  });

  return (
    <>
      <h1>Hello {}</h1>
    </>
  );
}

export default Home;
