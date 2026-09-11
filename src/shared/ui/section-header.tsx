
function SectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center space-y-2 text-center">
      <h2 className="text-lg leading-[36.4px] tracking-[-0.64px] font-medium text-black">{title}</h2>
      <p className="max-w-xl text-center text-base leading-[1.6] text-gray-500">
        {description}
      </p>
    </div>
  )
}

export { SectionHeader }
