import Image from "next/image";
import Link from "next/link";
import { Sparkles, Target } from "lucide-react";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center m-auto bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 sm:px-6">
      {/* Header com logo */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
        <Image
          src="/ozemfirelogo.png.png"
          alt="Ozemfire Logo"
          width={80}
          height={80}
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 drop-shadow-lg"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="text-center space-y-6 sm:space-y-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
        {/* Logo principal com animação suave */}
        <div className="relative flex justify-center items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full blur-xl sm:blur-2xl lg:blur-3xl opacity-100 animate-pulse"></div>
          <Image
            className="relative z-10 animate-float drop-shadow-2xl w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64"
            src="/simbolo.png"
            alt="Ozemfire"
            width={256}
            height={256}
          />
        </div>

        {/* Título e descrição */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent leading-tight">
            Ozemfire
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-600 leading-relaxed px-2 sm:px-0">
            Crie sua cartilha de treino personalizada com inteligência
            artificial,
            <span className="text-pink-500 font-medium block sm:inline">
              {" "}
              feita especialmente para você
            </span>
          </p>
        </div>

        {/* Botão de ação */}
        <div className="pt-2 sm:pt-4">
          <Link href="/form">
            <button className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white font-semibold rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-pink-500 hover:to-purple-600 w-full sm:w-auto">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Começar Agora <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </div>

        {/* Elementos decorativos */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mt-8 sm:mt-12">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-300 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-300 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-400 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 sm:bottom-8 text-center px-4">
        <p className="text-xs sm:text-sm text-gray-400 font-light flex items-center justify-center gap-1 sm:gap-2">
          <Target className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">
            Transforme seus objetivos em realidade
          </span>
          <span className="sm:hidden">Transforme seus objetivos</span>
        </p>
      </div>
    </section>
  );
}
