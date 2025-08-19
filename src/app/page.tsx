import Image from "next/image";
import Link from "next/link";
import { Sparkles, Target, Heart, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center m-auto bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header com logo */}

      {/* Conteúdo principal */}
      <div className="text-center space-y-8 px-6">
        {/* Logo principal com animação suave */}
        <div className="relative flex justify-center items-center">
          <div
            className="absolute inset-0
           bg-gradient-to-r
            from-pink-200 to-purple-200 rounded-full blur-2xl
             opacity-100 animate-pulse"
          ></div>
          <Image
            className="relative z-10 animate-float drop-shadow-2xl"
            src="/simbolo.png"
            alt="Ozemfire"
            width={200}
            height={200}
          />
        </div>

        {/* Título e descrição */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Ozemfire <br /> - Mounjaro Effects -
          </h1>
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Crie sua cartilha de treino personalizada com inteligência
            artificial,
            <span className="text-pink-500 font-medium">
              {" "}
              feita especialmente para você
            </span>
          </p>
        </div>

        {/* Botão de ação */}
        <Link href="/form">
          <button className="group relative px-8 py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-pink-500 hover:to-purple-600">
            <span className="relative z-10 flex items-center gap-2">
              Começar Agora <Sparkles className="w-5 h-5" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </Link>

        {/* Elementos decorativos */}
        <div className="flex justify-center space-x-4 mt-12">
          <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-purple-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center">
        <p className="text-sm text-gray-400 font-light flex items-center justify-center gap-2">
          <Target className="w-4 h-4" />
          Transforme seus objetivos em realidade
        </p>
      </div>
    </section>
  );
}
