/** Subtítulo con inicial caligráfica. Solo para textos cortos. */
export default function Titulo({ texto, className = '' }: { texto: string; className?: string }) {
  return (
    <h3 aria-label={texto} className={`subtitulo ${className}`}>
      <span aria-hidden="true">
        <span className="inicial">{texto[0]}</span>
        {texto.slice(1)}
      </span>
    </h3>
  )
}
