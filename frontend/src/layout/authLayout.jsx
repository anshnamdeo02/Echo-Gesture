import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'

export default function AuthLayout(){

    return (
        <>
            <Outlet />
            <Toaster />
        </>
    )
}