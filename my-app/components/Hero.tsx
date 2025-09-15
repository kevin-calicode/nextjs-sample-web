type Props = {title: string; sub?: string}

export function Hero({title, sub}: Props) {
    return (
        <section className="py-16 text-center">
            <h1 className="text-3xl sm:text-5xl font-bold">
                {title}
            </h1>
            {sub && <p className="mt-3 text-zinc-600 dark:text-zinc-400">{sub}</p>}
        </section>
    );
}
