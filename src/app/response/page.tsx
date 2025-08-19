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
    <div className="min-h-screen bg-feminine-gradient">
      {/* Header com botões de ação */}
      <div className="bg-white/90 backdrop-blur-sm shadow-feminine p-4 flex justify-between items-center">
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

        <div className="flex gap-4">
          <button
            onClick={handlePrint}
            className="feminine-button px-6 py-3 text-sm relative group flex items-center gap-2"
            title="Clique para imprimir ou salvar como PDF"
          >
            <Printer className="w-4 h-4 mr-2" />
            Gerar PDF
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Clique para imprimir ou salvar como PDF
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
            </div>
          </button>

          <Link href="/form">
            <button className="feminine-button px-6 py-3 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nova Consulta
            </button>
          </Link>
        </div>
      </div>

      {/* Conteúdo principal - Estilo A4 */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-feminine overflow-hidden print:shadow-none print:rounded-none">
          {/* Cabeçalho da folha */}
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 p-8 text-white text-center print:break-inside-avoid">
            <div className="flex flex-col items-center justify-center mb-4">
              <Image
                src="/simbolo.png"
                alt="Ozemfire"
                width={40}
                height={40}
                className="drop-shadow-lg mr-4"
              />
              <div>
                <h1 className="text-4xl font-bold">OzemFire</h1>
              </div>
            </div>
            <div className="w-24 h-1 bg-white/30 mx-auto rounded-full"></div>
          </div>

          {/* Informações do usuário */}
          <div className="p-8 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <User className="w-6 h-6 text-pink-500" />
              Dados Pessoais
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-pink-50 rounded-2xl p-4 border-l-4 border-pink-400">
                <h3 className="font-semibold text-pink-600 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informações Básicas
                </h3>
                <div className="space-y-2 text-gray-700">
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

              <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-400">
                <h3 className="font-semibold text-purple-600 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Medidas
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Peso:</strong> {dados.peso} kg
                  </p>
                  <p>
                    <strong>Altura:</strong> {dados.altura} m
                  </p>
                </div>
              </div>

              <div className="bg-pink-50 rounded-2xl p-4 border-l-4 border-pink-400">
                <h3 className="font-semibold text-pink-600 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Objetivos
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Frequência:</strong> {dados.frequencia}
                  </p>
                  <p>
                    <strong>Objetivo:</strong> {dados.objetivo}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 border-l-4 border-purple-400">
                <h3 className="font-semibold text-purple-600 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Preferências
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Problema de saúde:</strong> {dados.problemSaude}
                  </p>
                  {dados.alimentos && (
                    <p>
                      <strong>Alimentos incluídos:</strong> {dados.alimentos}
                    </p>
                  )}
                  {dados.alergicos && (
                    <p>
                      <strong>Alimentos excluídos:</strong> {dados.alergicos}
                    </p>
                  )}
                </div>
              </div>

              {/* Nova seção para áreas do corpo */}
              {dados.areasCorpo && (
                <div className="bg-pink-50 rounded-2xl p-4 border-l-4 border-pink-400 col-span-1 md:col-span-2">
                  <h3 className="font-semibold text-pink-600 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Áreas para Perda de Gordura
                  </h3>

                  <div className="space-y-2 text-gray-700">
                    {Object.entries(dados.areasCorpo)
                      .filter(([key, value]) => value)
                      .map(([key, value]) => {
                        const areaNames = {
                          A: "Abdômen",
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
                            className="inline-block bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                          >
                            {areaNames[key as keyof typeof areaNames]}
                          </span>
                        );
                      })}
                    {dados.outrasAreas && (
                      <div className="mt-3 p-3 bg-pink-100 rounded-lg">
                        <strong>Áreas específicas:</strong> {dados.outrasAreas}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Conteúdo gerado pela IA */}
          <div className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 print:break-inside-avoid">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <Dumbbell className="w-6 h-6 text-pink-500" />
              Seu Treino Personalizado
            </h2>

            <div className="bg-white rounded-2xl p-6 shadow-feminine">
              <div className="prose prose-pink max-w-none">
                {texto.split("\n").map((linha, index) => {
                  if (linha.trim() === "") return <br key={index} />;

                  // Detectar títulos e aplicar estilos
                  if (
                    linha.trim().toUpperCase() === linha.trim() &&
                    linha.length < 50
                  ) {
                    return (
                      <h3
                        key={index}
                        className="text-xl font-bold text-pink-600 mb-4 mt-6 border-b-2 border-pink-200 pb-2"
                      >
                        {linha}
                      </h3>
                    );
                  }

                  // Detectar listas
                  if (
                    linha.trim().startsWith("-") ||
                    linha.trim().startsWith("•")
                  ) {
                    return (
                      <li
                        key={index}
                        className="text-gray-700 mb-2 flex items-start"
                      >
                        <span className="text-pink-400 mr-2">•</span>
                        {linha.replace(/^[-•]\s*/, "")}
                      </li>
                    );
                  }

                  // Detectar números de exercícios
                  if (/^\d+\./.test(linha.trim())) {
                    return (
                      <div
                        key={index}
                        className="bg-pink-50 rounded-lg p-3 mb-3 border-l-4 border-pink-400"
                      >
                        <p className="text-gray-800 font-medium">{linha}</p>
                      </div>
                    );
                  }

                  // Texto normal
                  return (
                    <p
                      key={index}
                      className="text-gray-700 mb-3 leading-relaxed"
                    >
                      {linha}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 p-6 text-white text-center print:break-inside-avoid">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Apple className="w-4 h-4 text-white" />
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-sm opacity-90">
              Transforme seus objetivos em realidade com OzemFire
            </p>
            <p className="text-xs opacity-70 mt-2">
              Gerado em {new Date().toLocaleDateString("pt-BR")} às{" "}
              {new Date().toLocaleTimeString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* Estilos específicos para impressão */}
      <style jsx global>{`
        @media print {
          /* Reset básico para impressão */
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }

          /* Ocultar elementos desnecessários */
          .feminine-button,
          .bg-feminine-gradient {
            display: none !important;
          }

          /* Manter fundos importantes */
          .bg-white {
            background: white !important;
          }

          .bg-pink-50 {
            background: #fdf2f8 !important;
          }

          .bg-purple-50 {
            background: #faf5ff !important;
          }

          /* Manter gradientes como cores sólidas */
          .bg-gradient-to-r.from-pink-400.via-purple-400.to-pink-500 {
            background: #ec4899 !important;
            color: white !important;
          }

          /* Manter sombras como bordas */
          .shadow-feminine {
            border: 1px solid #e5e7eb !important;
          }

          /* Ajustar margens para A4 */
          @page {
            size: A4;
            margin: 1.5cm;
          }

          /* Manter cores de texto importantes */
          .text-pink-500,
          .text-pink-600 {
            color: #be185d !important;
          }

          .text-purple-600 {
            color: #9333ea !important;
          }

          .text-gray-700 {
            color: #374151 !important;
          }

          .text-gray-800 {
            color: #1f2937 !important;
          }

          /* Manter bordas visíveis */
          .border-l-4 {
            border-left: 2px solid #333 !important;
          }

          /* Otimizar cards para impressão */
          .bg-pink-50,
          .bg-purple-50 {
            border: 1px solid #ddd !important;
            margin-bottom: 1em;
            padding: 0.75em !important;
          }

          /* Manter espaçamentos */
          .p-8 {
            padding: 1em !important;
          }

          .p-6 {
            padding: 0.75em !important;
          }

          .mb-8 {
            margin-bottom: 1em !important;
          }

          .mb-6 {
            margin-bottom: 0.75em !important;
          }

          .mb-4 {
            margin-bottom: 0.5em !important;
          }

          .mb-3 {
            margin-bottom: 0.375em !important;
          }

          .mb-2 {
            margin-bottom: 0.25em !important;
          }

          .mt-6 {
            margin-top: 0.75em !important;
          }

          .mt-4 {
            margin-top: 0.5em !important;
          }

          /* Manter tamanhos de fonte */
          .text-4xl {
            font-size: 2em !important;
          }

          .text-2xl {
            font-size: 1.5em !important;
          }

          .text-xl {
            font-size: 1.25em !important;
          }

          .text-lg {
            font-size: 1.125em !important;
          }

          .text-sm {
            font-size: 0.875em !important;
          }

          .text-xs {
            font-size: 0.75em !important;
          }

          /* Manter pesos de fonte */
          .font-bold {
            font-weight: bold !important;
          }

          .font-semibold {
            font-weight: 600 !important;
          }

          .font-medium {
            font-weight: 500 !important;
          }

          /* Manter alinhamentos */
          .text-center {
            text-align: center !important;
          }

          /* Manter grid layout */
          .grid {
            display: grid !important;
          }

          .grid-cols-1 {
            grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
          }

          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .gap-6 {
            gap: 1.5em !important;
          }

          /* Manter flexbox */
          .flex {
            display: flex !important;
          }

          .items-center {
            align-items: center !important;
          }

          .justify-center {
            justify-content: center !important;
          }

          .justify-between {
            justify-content: space-between !important;
          }

          /* Manter espaçamentos */
          .space-y-6 > * + * {
            margin-top: 1.5em !important;
          }

          .space-y-4 > * + * {
            margin-top: 1em !important;
          }

          .space-y-2 > * + * {
            margin-top: 0.5em !important;
          }

          /* Manter bordas arredondadas como retângulos */
          .rounded-3xl {
            border-radius: 0 !important;
          }

          .rounded-2xl {
            border-radius: 0 !important;
          }

          .rounded-lg {
            border-radius: 0 !important;
          }

          /* Manter overflow */
          .overflow-hidden {
            overflow: visible !important;
          }

          /* Manter max-width */
          .max-w-4xl {
            max-width: none !important;
          }

          /* Manter mx-auto */
          .mx-auto {
            margin-left: auto !important;
            margin-right: auto !important;
          }

          /* Manter p-6 */
          .p-6 {
            padding: 0.75em !important;
          }

          /* Manter opacidades */
          .opacity-90 {
            opacity: 0.9 !important;
          }

          .opacity-70 {
            opacity: 0.7 !important;
          }

          /* Manter quebras de página */
          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }

          /* Otimizar para impressão */
          body {
            font-size: 11pt;
            line-height: 1.3;
            color: #333 !important;
          }

          /* Manter títulos visíveis */
          h1,
          h2,
          h3 {
            color: #333 !important;
            page-break-after: avoid;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }
        }
      `}</style>
    </div>
  );
}

export default function ResponseData() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResponseContent />
    </Suspense>
  );
}
