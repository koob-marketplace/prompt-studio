import Image from 'next/image';

export function Logos04() {
  return (
    <div className="py-5 flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-10 px-20 text-muted-foreground text-center text-2xl font-extrabold">
        Test all LLM in once and one place.
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto grid grid-cols-2 p-2 border sm:grid-cols-4 lg:grid-cols-6">
          {[
            <Image src="/asset/openai.png" alt="OpenAI" key="openai" width={40} height={40} />,
            <Image src="/asset/claude.png" alt="Claude" key="claude" width={40} height={40} />,
            <Image src="/asset/mistral.png" alt="Mistral" key="mistral" width={40} height={40} />,
            <Image src="/asset/gemini.png" alt="Gemini" key="gemini" width={40} height={40} />,
            <Image src="/asset/xAI.png" alt="Grok" key="grok" width={40} height={40} />,
            <Image src="/asset/cohere.png" alt="Cohere" key="cohere" width={40} height={40} />,
          ].map((Logo, i) => (
            <div
              key={i}
              className="flex h-30 w-30 items-center justify-center border md:h-40 md:w-40"
            >
              {Logo}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  