import { useAppSelector } from "src/store/redux/hooks";

function TestButton() {
  const userName = useAppSelector((state) => state.auth.userName);

  function testFunction() {
    throw new Error('Test error - ' + process.env.NODE_ENV);
  }

  if (userName !== 'admin-Sven Firmbach') {
    return null;
  }

  return (
    <button onClick={testFunction} style={{ position: 'absolute', bottom: 10, left: 10 }}>Test</button>
  );
}

export default TestButton;
