export default function AppLogo() {
    return (
        <>
            <div className=" flex aspect-square size-8 items-center justify-center rounded-md">
                {/* Usando la imagen del logo en lugar de AppLogoIcon */}
                <img src="/logo.png" alt="App Logo" className="size-10 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">VETERINARIA</span>
            </div>
        </>
    );
}