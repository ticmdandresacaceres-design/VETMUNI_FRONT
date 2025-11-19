import { MascotaProvider } from '@/src/features/admin-dashboard/mascotas/context/MascotaContext';
import MascotaPageDetails from '@/src/features/admin-dashboard/mascotas/components/MascotaPageDetails';

function MascotaPageHome() {
    return (
        <MascotaProvider>
            <MascotaPageDetails />
        </MascotaProvider>
    );
}

export default MascotaPageHome;