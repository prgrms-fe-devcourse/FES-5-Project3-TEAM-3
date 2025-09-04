import { RouterProvider } from 'react-router';
import { routes } from './router/routes';
import { useEffect} from 'react';
import { useAuth } from './store/@store';

function App() {
  useEffect(() => {
    const unsub = useAuth.getState().subscribe();
    useAuth.getState().fetch();
    return unsub;
  }, []);


  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;


