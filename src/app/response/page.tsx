"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Printer,
  Sparkles,
  User,
  Target,
  Dumbbell,
  Heart,
  Apple,
  MapPin,
  Calendar,
  Scale,
  Ruler,
  Zap,
  AlertTriangle,
} from "lucide-react";

interface UserData {
  nome: string;
  idade: string;
  peso: string;
  altura: string;
  sexo: string;
  frequencia: string;
  objetivo: string;
  problemSaude: string;
  alimentos: string;
  alergicos: string;
  areasCorpo: Record<string, boolean>;
  outrasAreas: string;
}

function ResponseContent() {
  const searchParams = useSearchParams();
  const [texto, setTexto] = useState("");
  const [dados, setDados] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const textoParam = searchParams.get("texto");
    const dadosParam = searchParams.get("dados");

    console.log("Parâmetros recebidos:", { textoParam, dadosParam });

    if (textoParam && dadosParam) {
      try {
        const textoDecodificado = decodeURIComponent(textoParam);
        const dadosDecodificados = decodeURIComponent(dadosParam);

        console.log("Texto decodificado:", textoDecodificado);
        console.log("Dados decodificados:", dadosDecodificados);

        const dadosParseados = JSON.parse(dadosDecodificados);
        console.log("Dados parseados:", dadosParseados);

        setTexto(textoDecodificado);
        setDados(dadosParseados);
      } catch (error) {
        console.error("Erro detalhado ao decodificar parâmetros:", error);
        console.error("Texto param:", textoParam);
        console.error("Dados param:", dadosParam);
      }
    } else {
      console.log("Parâmetros ausentes, verificando localStorage...");
      // Tentar buscar dados do localStorage como fallback
      try {
        const dadosLocalStorage = localStorage.getItem("ozemfire_dados");
        if (dadosLocalStorage) {
          const dadosParseados = JSON.parse(dadosLocalStorage);
          console.log("Dados encontrados no localStorage:", dadosParseados);

          setTexto(dadosParseados.texto);
          setDados(dadosParseados.dados);

          // Limpar localStorage após usar
          localStorage.removeItem("ozemfire_dados");
        } else {
          console.log("Nenhum dado encontrado no localStorage");
        }
      } catch (error) {
        console.error("Erro ao ler localStorage:", error);
      }
    }
    setLoading(false);
  }, [searchParams]);

  const handlePrint = () => {
    // Aguardar um pouco para os estilos serem aplicados
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!dados || !texto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-2xl p-8 shadow-feminine">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Nenhum dado encontrado
            </h1>
            <p className="text-gray-600 mb-6">
              Parece que não há dados para exibir. Por favor, volte ao
              formulário e crie seu treino personalizado.
            </p>
            <Link href="/form">
              <button className="feminine-button px-6 py-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Voltar ao Formulário
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header com botões de ação */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link href="/">
            <Image
              src="/simbolo.png"
              alt="Ozemfire Logo"
              width={40}
              height={40}
              className="drop-shadow-lg hover:scale-110 transition-transform duration-300"
              style={{
                filter: "drop-shadow(0 0 10px rgba(249, 102,186, 1))",
              }}
            />
          </Link>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handlePrint}
              className="feminine-button px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm relative group flex items-center gap-2 w-full sm:w-auto"
              title="Clique para imprimir ou salvar como PDF"
            >
              <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Gerar PDF
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                Clique para imprimir ou salvar como PDF
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </button>

            <Link href="/form">
              <button className="feminine-button px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm flex items-center gap-2 w-full sm:w-auto">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Nova Consulta
              </button>
            </Link>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="bg-white rounded-3xl shadow-feminine overflow-hidden print:shadow-none">
          {/* Cabeçalho da folha */}
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 p-4 sm:p-6 lg:p-8 text-white text-center print:break-inside-avoid">
            <div className="flex flex-col items-center justify-center mb-4">
              <Image
                src="/simbolo.png"
                alt="Ozemfire"
                width={40}
                height={40}
                className="drop-shadow-lg mb-2 sm:mb-0 sm:mr-4"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  OzemFire
                </h1>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Apple className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Informações do usuário */}
          <div className="p-4 sm:p-6 lg:p-8 print:break-inside-avoid">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              Dados Pessoais
            </h2>

            {/* Grid de informações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-pink-50 rounded-2xl p-3 sm:p-4 border-l-4 border-pink-400">
                <h3 className="font-semibold text-pink-600 text-xs sm:text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Informações Básicas
                </h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>Nome:</strong> {dados.nome}
                  </p>
                  <p>
                    <strong>Idade:</strong> {dados.idade} anos
                  </p>
                  <p>
                    <strong>Sexo:</strong> {dados.sexo}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-3 sm:p-4 border-l-4 border-purple-400">
                <h3 className="font-semibold text-purple-600 text-xs sm:text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Ruler className="w-3 h-3 sm:w-4 sm:h-4" />
                  Medidas
                </h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>Peso:</strong> {dados.peso} kg
                  </p>
                  <p>
                    <strong>Altura:</strong> {dados.altura} m
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 rounded-2xl p-3 sm:p-4 border-l-4 border-pink-400">
                <h3 className="font-semibold text-pink-600 text-xs sm:text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  Objetivos
                </h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>Objetivo:</strong> {dados.objetivo}
                  </p>
                  <p>
                    <strong>Frequência:</strong> {dados.frequencia}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-3 sm:p-4 border-l-4 border-purple-400">
                <h3 className="font-semibold text-purple-600 text-xs sm:text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4" />
                  Preferências
                </h3>
                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>Alimentos incluídos:</strong> {dados.alimentos}
                  </p>
                  <p>
                    <strong>Alimentos excluídos:</strong>{" "}
                    {dados.alergicos || "Nenhum"}
                  </p>
                </div>
              </div>

              {/* Áreas para perda de gordura */}
              {dados.areasCorpo && (
                <div className="bg-pink-50 rounded-2xl p-3 sm:p-4 border-l-4 border-pink-400 col-span-1 sm:col-span-2">
                  <h3 className="font-semibold text-pink-600 text-xs sm:text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                    Áreas para Perda de Gordura
                  </h3>
                  <div className="text-xs sm:text-sm">
                    {Object.entries(dados.areasCorpo)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => {
                        const areaNames = {
                          A: "Abdomen",
                          B: "Culotes",
                          C: "Braços",
                          D: "Quadris",
                          E: "Pernas",
                          F: "Outras áreas",
                          G: "Nenhuma",
                          H: "Todo o corpo",
                        };
                        return (
                          <span
                            key={key}
                            className="inline-block bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs mr-2 mb-2"
                          >
                            {areaNames[key as keyof typeof areaNames]}
                          </span>
                        );
                      })}
                    {dados.outrasAreas && (
                      <p className="mt-2">
                        <strong>Específico:</strong> {dados.outrasAreas}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Problema de saúde */}
              {dados.problemSaude && (
                <div className="bg-orange-50 rounded-2xl p-3 sm:p-4 border-l-4 border-orange-400 col-span-1 sm:col-span-2">
                  <h3 className="font-semibold text-orange-600 text-xs sm:text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Considerações de Saúde
                  </h3>
                  <p className="text-xs sm:text-sm">{dados.problemSaude}</p>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo gerado pela IA */}
          <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-pink-50 to-purple-50 print:break-inside-avoid">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
              Seu Treino Personalizado
            </h2>

            <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
              {texto.split("\n").map((line, index) => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return <br key={index} />;

                if (trimmedLine.match(/^\d+\./)) {
                  return (
                    <div key={index} className="flex items-start gap-3 mb-3">
                      <span className="bg-pink-500 text-white text-xs sm:text-sm font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {trimmedLine.match(/^\d+/)?.[0]}
                      </span>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {trimmedLine.replace(/^\d+\.\s*/, "")}
                      </p>
                    </div>
                  );
                }

                if (trimmedLine.match(/^[A-Z][^:]*:/)) {
                  return (
                    <h3
                      key={index}
                      className="text-lg sm:text-xl font-bold text-pink-600 mt-6 mb-3 border-l-4 border-pink-400 pl-3"
                    >
                      {trimmedLine}
                    </h3>
                  );
                }

                if (
                  trimmedLine.startsWith("-") ||
                  trimmedLine.startsWith("•")
                ) {
                  return (
                    <div key={index} className="flex items-start gap-3 mb-2">
                      <span className="text-pink-500 text-lg mt-0.5">•</span>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                        {trimmedLine.replace(/^[-•]\s*/, "")}
                      </p>
                    </div>
                  );
                }

                return (
                  <p
                    key={index}
                    className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3"
                  >
                    {trimmedLine}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 p-4 sm:p-6 lg:p-8 text-white text-center print:break-inside-avoid">
            <p className="text-sm sm:text-base font-light mb-4">
              Este treino foi personalizado especialmente para você pela
              inteligência artificial do Ozemfire
            </p>
            <p className="text-xs sm:text-sm opacity-90">
              Lembre-se de consultar um profissional de saúde antes de iniciar
              qualquer programa de exercícios
            </p>
          </div>
        </div>

        {/* Botão de voltar */}
        <div className="text-center mt-6 sm:mt-8">
          <Link href="/form">
            <button className="feminine-button px-6 sm:px-8 py-3 flex items-center gap-2 mx-auto">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Voltar ao Formulário
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResponseData() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResponseContent />
    </Suspense>
  );
}
