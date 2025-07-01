import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [loadingQuestion, setLoadingQuestion] = useState(false);

  // Funcion para validar la pregunta - debe empezar con "¿" y terminar con "?" o terminar con "?"
  const isValidQuestion = (text) => {
    const trimmed = text.trim();
    return (
      (trimmed.startsWith("¿") && trimmed.endsWith("?")) ||
      trimmed.endsWith("?")
    );
  };

  // Metodo para caputrar la pregunta y consultar la API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setError("Por favor, escribe una pregunta");
      return;
    }

    if (!isValidQuestion(question)) {
      setError(
        "La pregunta debe estar entre signos de interrogación (¿...?) o terminar con ?"
      );
      return;
    }
    // Reiniciar estados - errores y loading
    setError("");
    setLoading(true);
    setResponse(null);
    setLoadingQuestion(true);

    // Envio request a la API
    try {
      const res = await axios.get("https://yesno.wtf/api");
      const newResponse = {
        question,
        answer: res.data.answer,
        image: res.data.image,
        timestamp: new Date().toLocaleTimeString(),
      };

      setLoadingQuestion(false);
      setResponse(newResponse);
      setHistory((prev) => [newResponse, ...prev.slice(0, 4)]);
      setQuestion("");
    } catch (err) {
      setError("Error al consultar la API. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Funcion para setear color en respuesta
  const getResponseColor = (answer) => {
    switch (answer) {
      case "yes":
        return "#10B981";
      case "no":
        return "#EF4444";
      case "maybe":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  // Funcion para traducir respuesta al español
  const getSpanishAnswer = (answer) => {
    switch (answer) {
      case "yes":
        return "SÍ";
      case "no":
        return "NO";
      case "maybe":
        return "QUIZÁS";
      default:
        return answer;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">🎱 Pregúntame Cualquier Cosa</h1>
        <p className="subtitle">
          Haz una pregunta y obtén una respuesta del universo
        </p>

        <div className="main-content">
          <div className="left-section">
            <form onSubmit={handleSubmit} className="form">
              <div className="input-group">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="¿Tu pregunta aquí?"
                  className="input"
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading || !question.trim()}
                >
                  {loading ? "🔮" : "✨"}
                </button>
              </div>
              {error && <p className="error">{error}</p>}
            </form>

            {loadingQuestion && (
              <div className="loading loading-attractive">
                <p className="loading-text">Consultando el universo...</p>
                <img
                  src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif"
                  alt="Cargando..."
                  className="spinner-gif"
                  style={{ width: 80, height: 80, margin: "16px auto" }}
                />
                <p className="loading-subtext">
                  ¡La bola mágica está pensando!
                </p>
              </div>
            )}

            {response && (
              <div className="response-container">
                <div className="response-card">
                  <h3 className="response-question">"{response.question}"</h3>
                  <div
                    className="response-answer"
                    style={{ color: getResponseColor(response.answer) }}
                  >
                    {getSpanishAnswer(response.answer)}
                  </div>
                  <div className="image-container">
                    <img
                      src={response.image}
                      alt={response.answer}
                      className="response-image"
                    />
                  </div>
                  <small className="timestamp">{response.timestamp}</small>
                </div>
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="history">
              <h3 className="history-title">Historial Reciente</h3>
              <div className="history-list">
                {history.map((item, index) => (
                  <div key={index} className="history-item">
                    <span className="history-question">"{item.question}"</span>
                    <span
                      className="history-answer"
                      style={{ color: getResponseColor(item.answer) }}
                    >
                      {getSpanishAnswer(item.answer)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
