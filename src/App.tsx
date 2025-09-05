import { RouterProvider } from 'react-router';
import { routes } from './router/routes';
import { useEffect} from 'react';
import { useAuth } from './store/@store';
import { useSearchStore } from './store/searchStore';

function App() {
  const {userId} = useAuth()
  useEffect(() => {
    const unsub = useAuth.getState().subscribe();
    useAuth.getState().fetch();
    return unsub;
  }, []);

  useEffect(() => {
  useSearchStore.persist.rehydrate();
}, [userId]);

  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;


