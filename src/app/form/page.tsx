"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Calendar,
  Target,
  Heart,
  Apple,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Dumbbell,
  MapPin,
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
    <main className="min-h-screen bg-feminine-gradient relative">
      {/* Header com logo */}
      <div className="absolute top-6 left-6 z-10">
        <Link href="/">
          <Image
            src="/ozemfirelogo.png.png"
            alt="Ozemfire Logo"
            width={50}
            height={50}
            className="drop-shadow-lg hover:scale-110 transition-transform duration-300"
          />
        </Link>
      </div>

      {loading ? (
        <section className="h-screen z-50 bg-black/80 w-screen absolute flex flex-col items-center justify-center m-auto">
          <div className="feminine-spinner"></div>
          <p className="pt-8 font-light text-lg ml-2 animate-pulse text-center text-white">
            Aguarde,{" "}
            <span className="text-pink-300 font-medium">Ozemfire IA</span> está{" "}
            <br />
            analisando seus dados... ✨
          </p>
        </section>
      ) : null}

      <section className="min-h-screen flex flex-col items-center justify-center m-auto px-6 py-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Crie Seu Treino Personalizado
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Preencha as informações abaixo e nossa IA criará um plano de treino
            e dieta
            <span className="text-pink-500 font-medium">
              {" "}
              feito especialmente para você
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div id="form1" className="space-y-6">
            {/* Informações básicas */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-feminine">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                <User className="w-6 h-6 text-pink-500" />
                Informações Básicas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    className="feminine-input w-full"
                    required
                    type="text"
                    name="name"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <input
                    className="feminine-input w-full"
                    required
                    type="number"
                    name="idade"
                    placeholder="Sua idade"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    className="feminine-input w-full"
                    type="number"
                    required
                    name="peso"
                    placeholder="Seu peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (m)
                  </label>
                  <input
                    className="feminine-input w-full"
                    name="altura"
                    required
                    placeholder="Ex: 1.60"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo
                </label>
                <select
                  className="feminine-select w-full"
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

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequência de treino
                </label>
                <select
                  className="feminine-select w-full"
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

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo
                </label>
                <select
                  className="feminine-select w-full"
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

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => {
                    const dietaDiv1 = document.getElementById("form1");
                    const dietaDiv = document.getElementById("form2");
                    const camposObrigatorios = [
                      nome,
                      idade,
                      peso,
                      altura,
                      sexo,
                      frequencia,
                      objetivo,
                    ];

                    const camposVazios = camposObrigatorios.filter(
                      (campo) => campo === ""
                    );

                    if (camposVazios.length > 0) {
                      alert(
                        "Por favor, preencha todos os campos obrigatórios."
                      );
                      return false;
                    } else {
                      dietaDiv1?.classList.add("hidden");
                      dietaDiv?.classList.remove("hidden");
                    }

                    return true;
                  }}
                  type="button"
                  className="feminine-button px-8 py-3 text-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Próximo <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div id="form2" className="w-full h-auto hidden space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-feminine">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                <Apple className="w-6 h-6 text-pink-500" />
                Informações Adicionais
              </h3>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-4">
                  Você tem algum problema de saúde?
                </p>
                <div className="flex items-center justify-center gap-8">
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
                    <label className="text-gray-700 text-sm ml-3 font-medium">
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
                    <label className="text-gray-700 text-sm ml-3 font-medium">
                      Não
                    </label>
                  </div>
                </div>
              </div>

              <div id="inputSaude" className="hidden mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva seu problema de saúde:
                </label>
                <input
                  className="feminine-input w-full"
                  type="text"
                  name="saude"
                  placeholder="Qual seu problema de saúde?"
                  value={problemSaude}
                  onChange={(e) => setProblemSaude(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quais alimentos você quer incluir em sua dieta?
                </label>
                <textarea
                  required
                  className="feminine-textarea w-full"
                  value={alimentos}
                  onChange={(e) => setAlimentos(e.target.value)}
                  placeholder="Ex: frutas, verduras, carnes magras..."
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quais alimentos você não deseja incluir?
                </label>
                <textarea
                  className="feminine-textarea w-full"
                  value={alergicos}
                  onChange={(e) => setAlergicos(e.target.value)}
                  placeholder="Ex: glúten, lactose, frutos do mar..."
                ></textarea>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    const dietaDiv2 = document.getElementById("form2");
                    const dietaDiv3 = document.getElementById("form3");
                    dietaDiv2?.classList.add("hidden");
                    dietaDiv3?.classList.remove("hidden");
                  }}
                  type="button"
                  className="feminine-button px-8 py-3 text-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Próximo <ArrowRight className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div id="form3" className="w-full h-auto hidden space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-feminine">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                <Target className="w-6 h-6 text-pink-500" />
                Áreas do Corpo para Perda de Gordura
              </h3>

              <p className="text-sm text-gray-600 mb-6 text-center">
                Em qual parte do corpo você deseja perder mais gordura?
              </p>

              {/* Imagem do corpo */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Image
                    src="/body.webp"
                    alt="Áreas do corpo - A=Abdômen, B=Culotes, C=Braços, D=Quadris, E=Pernas, F=Outras, G=Nenhuma, H=Todo o corpo"
                    width={150}
                    height={150}
                    className="rounded-lg shadow-feminine"
                    onLoad={() => setImagemCarregada(true)}
                    onError={() => setImagemCarregada(false)}
                    priority
                  />

                  {/* Legenda das áreas */}
                  {/* <div className="mt-4 text-center text-sm text-gray-600">
                    <p className="font-medium mb-2">Legenda das áreas:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <span>A = Abdômen</span>
                      <span>B = Culotes</span>
                      <span>C = Braços</span>
                      <span>D = Quadris</span>
                      <span>E = Pernas</span>
                      <span>F = Outras áreas</span>
                      <span>G = Nenhuma</span>
                      <span>H = Todo o corpo</span>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Checkboxes das áreas */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <input
                    id="areaA"
                    type="checkbox"
                    checked={areasCorpo.A}
                    onChange={() => handleAreaChange("A")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaA"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    A - Abdômen
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaB"
                    type="checkbox"
                    checked={areasCorpo.B}
                    onChange={() => handleAreaChange("B")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaB"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    B - Culotes
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaC"
                    type="checkbox"
                    checked={areasCorpo.C}
                    onChange={() => handleAreaChange("C")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaC"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    C - Braços
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaD"
                    type="checkbox"
                    checked={areasCorpo.D}
                    onChange={() => handleAreaChange("D")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaD"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    D - Quadris
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaE"
                    type="checkbox"
                    checked={areasCorpo.E}
                    onChange={() => handleAreaChange("E")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaE"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    E - Pernas
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaF"
                    type="checkbox"
                    checked={areasCorpo.F}
                    onChange={() => handleAreaChange("F")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaF"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    F - Outras áreas
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaG"
                    type="checkbox"
                    checked={areasCorpo.G}
                    onChange={() => handleAreaChange("G")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaG"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    G - Nenhuma
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="areaH"
                    type="checkbox"
                    checked={areasCorpo.H}
                    onChange={() => handleAreaChange("H")}
                    className="feminine-checkbox"
                  />
                  <label
                    htmlFor="areaH"
                    className="text-gray-700 text-sm ml-3 font-medium"
                  >
                    H - Todo o corpo
                  </label>
                </div>
              </div>

              {/* Textarea para outras áreas */}
              {areasCorpo.F && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qual seria a área específica do seu corpo?
                  </label>
                  <textarea
                    className="feminine-textarea w-full"
                    value={outrasAreas}
                    onChange={(e) => setOutrasAreas(e.target.value)}
                    placeholder="Descreva as áreas específicas..."
                  ></textarea>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  className="feminine-button px-8 py-3 text-lg"
                  type="submit"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Criar Meu Treino <Sparkles className="w-5 h-5" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="text-center mt-8 max-w-2xl">
          <p className="text-sm text-gray-500 font-light leading-relaxed flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span>
              <strong>Atenção:</strong> Procure um profissional credenciado.
              Lembre-se que este app retorna informações geradas por uma IA e
              deve ser usado como orientação complementar.
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}
