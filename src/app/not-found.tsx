import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center sm:px-6">
      <span aria-hidden className="text-6xl">
        🎮
      </span>
      <h1 className="headline mt-6 text-3xl text-white">Aquí no hay nada que ganar</h1>
      <p className="mt-3 text-sm text-mist-400">
        La página que buscas no existe o el sorteo ya se retiró. Prueba con los que están abiertos
        ahora mismo.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/sorteos"
          className="btn btn-primary px-7 py-4 text-sm"
        >
          Ver sorteos
        </Link>
        <Link
          href="/"
          className="btn btn-ghost px-7 py-4 text-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
