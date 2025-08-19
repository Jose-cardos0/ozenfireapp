"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Target,
  Apple,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const API_KEY = "AIzaSyD2DGLj6TrFyuU7rsigVe4UCIGmcKkzw-g";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function FormData() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [sexo, setSexo] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [loading, setLoading] = useState(false);
  const [problemSaude, setProblemSaude] = useState(
    "Não tenho nenhum problema de saúde"
  );
  const [alimentos, setAlimentos] = useState("");
  const [checkedSim, setCheckedSim] = useState(false);
  const [checkedNao, setCheckedNao] = useState(true);
  const [alergicos, setAlergicos] = useState("");

  // Novos estados para áreas do corpo
  const [areasCorpo, setAreasCorpo] = useState({
    A: false, // Abdomen
    B: false, // Culotes
    C: false, // Braços
    D: false, // Quadris
    E: false, // Pernas
    F: false, // Outras áreas
    G: false, // Nenhuma
    H: false, // Todo o corpo
  });
  const [outrasAreas, setOutrasAreas] = useState("");
  const [imagemCarregada, setImagemCarregada] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      // Validar campos obrigatórios
      const camposObrigatorios = [
        nome,
        idade,
        peso,
        altura,
        sexo,
        frequencia,
        objetivo,
        alimentos,
      ];

      const camposVazios = camposObrigatorios.filter(
        (campo) => !campo || campo.trim() === ""
      );

      if (camposVazios.length > 0) {
        const camposFaltando = [
          !nome ? "Nome" : "",
          !idade ? "Idade" : "",
          !peso ? "Peso" : "",
          !altura ? "Altura" : "",
          !sexo ? "Sexo" : "",
          !frequencia ? "Frequência de treino" : "",
          !objetivo ? "Objetivo" : "",
          !alimentos ? "Alimentos incluídos" : "",
        ].filter(Boolean);

        alert(
          `Por favor, preencha os seguintes campos obrigatórios:\n${camposFaltando.join(
            "\n"
          )}`
        );
        return;
      }

      // Construir string das áreas selecionadas
      const areasSelecionadas = Object.entries(areasCorpo)
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
          return areaNames[key as keyof typeof areaNames];
        })
        .join(", ");

      console.log("Áreas selecionadas:", areasSelecionadas);
      console.log("Dados do formulário:", {
        nome,
        idade,
        peso,
        altura,
        sexo,
        frequencia,
        objetivo,
        problemSaude,
        alimentos,
        alergicos,
        areasCorpo,
        outrasAreas,
      });

      const mensagem = `MONTE UM TREINO PARA UM ${sexo} de ${peso} com ${altura} e idade ${idade} anos.
     Ele frequenta a academia ${frequencia} e tem o foco de ${objetivo}. 
     Monte um treino 
     detalhado com as quantidades
     de repetição e progressão de carga adequada semanalmente. Lembre-se que se o ${sexo} for 
     feminino o treino deve ser focado em inferiores.
      Aproveite e monte uma dieta baseada no calculo IMC ${altura}, ${peso} e ${objetivo}. 
      Coloque os alimentos ${alimentos} no plano da dieta, remova os alimentos ${alergicos}. Lembre-se, eu tenho um problema de saúde que é ${problemSaude}, 
      monte o treino e a dieta de acordo com minhas necessidades e restrições. A dieta deve ser detalhada kcal por refeição, 
        quantidade de proteina, carboidrados e gordura por refeição. 
        O usuário deseja perder gordura nas seguintes áreas do corpo: ${areasSelecionadas}${
        outrasAreas ? `, especificamente: ${outrasAreas}` : ""
      }.`;

      console.log("Mensagem para IA:", mensagem);

      setLoading(true);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(mensagem);
      const response = await result.response;
      const texto = await response.text();

      console.log("Resposta da IA:", texto);

      // Codificar o texto para passar via URL
      const encodedText = encodeURIComponent(texto);
      const encodedData = encodeURIComponent(
        JSON.stringify({
          nome,
          idade,
          peso,
          altura,
          sexo,
          frequencia,
          objetivo,
          problemSaude,
          alimentos,
          alergicos,
          areasCorpo,
          outrasAreas,
        })
      );

      console.log("Dados codificados:", { encodedText, encodedData });

      // Verificar se a URL não está muito longa
      const urlCompleta = `/response?texto=${encodedText}&dados=${encodedData}`;
      console.log("URL completa:", urlCompleta);
      console.log("Tamanho da URL:", urlCompleta.length);

      if (urlCompleta.length > 2000) {
        console.warn("URL muito longa, usando método alternativo");
        // Armazenar dados no localStorage como fallback
        localStorage.setItem(
          "ozemfire_dados",
          JSON.stringify({
            texto,
            dados: {
              nome,
              idade,
              peso,
              altura,
              sexo,
              frequencia,
              objetivo,
              problemSaude,
              alimentos,
              alergicos,
              areasCorpo,
              outrasAreas,
            },
          })
        );

        // Redirecionar para página de resultado sem parâmetros
        router.push("/response");
        return;
      }

      // Redirecionar para a página de resultado
      router.push(urlCompleta);
    } catch (error) {
      console.error("Erro detalhado ao gerar conteúdo:", error);
      alert(
        `Ocorreu um erro ao gerar seu treino: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  const handleAreaChange = (area: string) => {
    setAreasCorpo((prev) => {
      const newState = { ...prev };

      // Se selecionar "Todo o corpo", desmarca as outras
      if (area === "H") {
        Object.keys(newState).forEach((key) => {
          newState[key as keyof typeof newState] = key === "H";
        });
      }
      // Se selecionar outras áreas, desmarca "Todo o corpo"
      else if (area !== "G") {
        newState.H = false;
        newState[area as keyof typeof newState] =
          !newState[area as keyof typeof newState];
      }
      // Se selecionar "Nenhuma", desmarca todas as outras
      else {
        Object.keys(newState).forEach((key) => {
          newState[key as keyof typeof newState] = key === "G";
        });
      }

      return newState;
    });
  };

  return (
    <main className="min-h-screen bg-feminine-gradient py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-3 sm:mb-4">
            Crie Seu Treino Personalizado
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            Preencha as informações abaixo e nossa IA criará um plano de treino
            e dieta
            <span className="text-pink-500 font-medium block sm:inline">
              {" "}
              feito especialmente para você
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
          {/* Primeira etapa - Informações básicas */}
          <div id="form1" className="w-full h-auto space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-feminine">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                Informações Básicas
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Nome */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    className="feminine-input w-full text-sm sm:text-base"
                    required
                    type="text"
                    name="name"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                {/* Idade e Peso em linha no mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Idade
                    </label>
                    <input
                      className="feminine-input w-full text-sm sm:text-base"
                      required
                      type="number"
                      name="idade"
                      placeholder="Sua idade"
                      value={idade}
                      onChange={(e) => setIdade(e.target.value)}
                    />
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Peso (kg)
                    </label>
                    <input
                      className="feminine-input w-full text-sm sm:text-base"
                      type="number"
                      required
                      name="peso"
                      placeholder="Seu peso"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                    />
                  </div>
                </div>

                {/* Altura */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Altura (m)
                  </label>
                  <input
                    className="feminine-input w-full text-sm sm:text-base"
                    name="altura"
                    required
                    placeholder="Ex: 1.60"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </div>

                {/* Sexo e Frequência em linha no mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Sexo
                    </label>
                    <select
                      className="feminine-select w-full text-sm sm:text-base"
                      name="sexo"
                      required
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                    >
                      <option value="">Selecione seu sexo</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Feminino">Feminino</option>
                    </select>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Frequência de treino
                    </label>
                    <select
                      className="feminine-select w-full text-sm sm:text-base"
                      name="frequencia"
                      required
                      value={frequencia}
                      onChange={(e) => setFrequencia(e.target.value)}
                    >
                      <option value="">Selecione a frequência</option>
                      <option value="não faço ne um exercício físico">
                        Não me exercito
                      </option>
                      <option value="7 dias">7 dias na semana</option>
                      <option value="5 dias">5 dias na semana</option>
                      <option value="3 dias">3 dias na semana</option>
                    </select>
                  </div>
                </div>

                {/* Objetivo */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Objetivo
                  </label>
                  <select
                    className="feminine-select w-full text-sm sm:text-base"
                    name="objetivo"
                    required
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                  >
                    <option value="">Selecione seu objetivo</option>
                    <option value="Hipertrofia">Hipertrofia</option>
                    <option value="Perca de peso">Perda de peso</option>
                    <option value="Manutenção da saúde">
                      Manutenção da saúde
                    </option>
                  </select>
                </div>
              </div>

              {/* Botão próximo */}
              <div className="text-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("form1")?.classList.add("hidden");
                    document
                      .getElementById("form2")
                      ?.classList.remove("hidden");
                  }}
                  className="feminine-button px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Próximo <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Segunda etapa - Informações adicionais */}
          <div
            id="form2"
            className="w-full h-auto hidden space-y-4 sm:space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-feminine">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
                <Apple className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                Informações Adicionais
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Problema de saúde */}
                <div className="mb-4 sm:mb-6">
                  <p className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
                    Você tem algum problema de saúde?
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-4 sm:gap-8">
                    <div className="flex items-center">
                      <input
                        onClick={() => {
                          const inputSaude =
                            document.getElementById("inputSaude");
                          inputSaude?.classList.remove("hidden");
                        }}
                        id="sim"
                        type="checkbox"
                        name="checkbox"
                        checked={checkedSim}
                        onChange={() => {
                          setCheckedSim(true);
                          setCheckedNao(false);
                        }}
                        className="feminine-checkbox"
                      />
                      <label className="text-gray-700 text-sm sm:text-base ml-3 font-medium">
                        Sim
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        onClick={() => {
                          const inputSaude =
                            document.getElementById("inputSaude");
                          inputSaude?.classList.add("hidden");
                        }}
                        id="nao"
                        type="checkbox"
                        name="checkbox"
                        checked={checkedNao}
                        onChange={() => {
                          setCheckedSim(false);
                          setCheckedNao(true);
                        }}
                        className="feminine-checkbox"
                      />
                      <label className="text-gray-700 text-sm sm:text-base ml-3 font-medium">
                        Não
                      </label>
                    </div>
                  </div>
                </div>

                {/* Input problema de saúde */}
                <div
                  id="inputSaude"
                  className={`mb-4 sm:mb-6 ${checkedSim ? "" : "hidden"}`}
                >
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Qual problema de saúde?
                  </label>
                  <textarea
                    className="feminine-textarea w-full text-sm sm:text-base"
                    value={problemSaude}
                    onChange={(e) => setProblemSaude(e.target.value)}
                    placeholder="Descreva seu problema de saúde..."
                    rows={3}
                  ></textarea>
                </div>

                {/* Alimentos incluídos */}
                <div className="mb-4 sm:mb-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Quais alimentos você quer incluir em sua dieta?
                  </label>
                  <textarea
                    required
                    className="feminine-textarea w-full text-sm sm:text-base"
                    value={alimentos}
                    onChange={(e) => setAlimentos(e.target.value)}
                    placeholder="Ex: frutas, verduras, carnes magras..."
                    rows={3}
                  ></textarea>
                </div>

                {/* Alimentos alergicos */}
                <div className="mb-6 sm:mb-8">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                    Quais alimentos você não deseja incluir?
                  </label>
                  <textarea
                    className="feminine-textarea w-full text-sm sm:text-base"
                    value={alergicos}
                    onChange={(e) => setAlergicos(e.target.value)}
                    placeholder="Ex: glúten, lactose, frutos do mar..."
                    rows={3}
                  ></textarea>
                </div>
              </div>

              {/* Botões de navegação */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("form2")?.classList.add("hidden");
                    document
                      .getElementById("form1")
                      ?.classList.remove("hidden");
                  }}
                  className="feminine-button px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto order-2 sm:order-1"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("form2")?.classList.add("hidden");
                    document
                      .getElementById("form3")
                      ?.classList.remove("hidden");
                  }}
                  className="feminine-button px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto order-1 sm:order-2"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Próximo <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Terceira etapa - Áreas do corpo */}
          <div
            id="form3"
            className="w-full h-auto hidden space-y-4 sm:space-y-6"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-feminine">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 text-center flex items-center justify-center gap-2">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
                Áreas do Corpo para Perda de Gordura
              </h3>

              <div className="space-y-4 sm:space-y-6">
                {/* Imagem do corpo */}
                <div className="text-center mb-4 sm:mb-6">
                  <Image
                    src="/body.webp"
                    alt="Áreas do corpo"
                    width={150}
                    height={150}
                    className="mx-auto rounded-lg shadow-lg"
                    onError={(e) =>
                      console.error("Erro ao carregar imagem:", e)
                    }
                    onLoad={() => console.log("Imagem carregada com sucesso")}
                  />
                </div>

                {/* Checkboxes das áreas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(areasCorpo).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={() => handleAreaChange(key)}
                        className="feminine-checkbox"
                      />
                      <label
                        htmlFor={key}
                        className="text-sm sm:text-base text-gray-700 ml-3 font-medium cursor-pointer"
                      >
                        {key === "A" && "Abdomen"}
                        {key === "B" && "Culotes"}
                        {key === "C" && "Braços"}
                        {key === "D" && "Quadris"}
                        {key === "E" && "Pernas"}
                        {key === "F" && "Outras áreas"}
                        {key === "G" && "Nenhuma"}
                        {key === "H" && "Todo o corpo"}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Textarea para outras áreas */}
                {areasCorpo.F && (
                  <div className="mb-4 sm:mb-6">
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2">
                      Qual seria a área específica do seu corpo?
                    </label>
                    <textarea
                      className="feminine-textarea w-full text-sm sm:text-base"
                      value={outrasAreas}
                      onChange={(e) => setOutrasAreas(e.target.value)}
                      placeholder="Descreva as áreas específicas..."
                      rows={3}
                    ></textarea>
                  </div>
                )}
              </div>

              {/* Botões de navegação */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById("form3")?.classList.add("hidden");
                    document
                      .getElementById("form2")
                      ?.classList.remove("hidden");
                  }}
                  className="feminine-button px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto order-2 sm:order-1"
                >
                  Anterior
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="feminine-button px-6 sm:px-8 py-3 text-base sm:text-lg w-full sm:w-auto order-1 sm:order-2"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Criar Meu Treino{" "}
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Aviso de atenção */}
        <div className="text-center mt-6 sm:mt-8 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-500 font-light leading-relaxed flex items-center justify-center gap-2 px-4">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
            <span>
              <strong>Atenção:</strong> Procure um profissional credenciado.
              Lembre-se que este app retorna informações geradas por uma IA e
              deve ser usado como orientação complementar.
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}
