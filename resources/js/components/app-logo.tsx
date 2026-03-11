import { useHasRole } from "@/hooks/use-hasrole"

export default function AppLogo() {
    const isRol3 = useHasRole(3) // Verifica rol 3

    const logo = isRol3 ? "/logo_onpe.png" : "/logo.png" // Logo según rol
    const title = isRol3 ? "ONPE" : "SALVADOR DE +COTAS" // Texto según rol

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md">
                <img src={logo} alt="App Logo" className="size-10 object-contain" />
            </div>

            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">
                    {title}
                </span>
            </div>
        </>
    )
}