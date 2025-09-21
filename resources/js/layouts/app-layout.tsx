import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import { ToastContainer } from 'react-toastify';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { props: pageProps } = usePage();

    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains('dark');

        const swalOptions = {
            background: isDarkMode ? '#1f2937' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: isDarkMode ? 'swal2-dark' : 'swal2-light'
            }
        };

        if (pageProps.success) {
            Swal.fire({
                title: 'Éxito!',
                text: pageProps.success,
                icon: 'success',
                ...swalOptions
            });
        }

        if (pageProps.error) {
            Swal.fire({
                title: 'Error!',
                text: pageProps.error,
                icon: 'error',
                ...swalOptions
            });
        }
    }, [pageProps.success, pageProps.error]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <ToastContainer />
        </AppLayoutTemplate>
    );
};
