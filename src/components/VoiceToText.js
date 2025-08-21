import { useState, useEffect, useRef } from "react";
import { createClient } from "@deepgram/sdk";
import { LiveTranscriptionEvents } from "@deepgram/sdk";
import stringSimilarity from "string-similarity";

const VoiceToText = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [coveredStatements, setCoveredStatements] = useState([]);
  const [uncoveredStatements, setUncoveredStatements] = useState([]);
  const [score, setScore] = useState(0);
  const deepgramClientRef = useRef(null); // Store the Deepgram client
  const mediaStreamRef = useRef(null);

  const complianceStatements = [
    "Are you under Administration?",
    "debt counselling ?",
    "sequestration?",
    "Credit Reference Check?",
    "Authorised Financial Services",
    "Credit Provider",
    "Professional Indemnity and Fidelity Insurance Cover",
    "calls are recorded for quality and security purposes.",
    "I am a representative working under supervision",
    "authorised to sell Long Term Insurance",
    "including Short- and Long-term deposits.",
    "Permission to process and share your personal information",
    "with the Credit Bureau and the underwriter Gaurd Risk",
    "ID number",
    "full names and surname",
    "contact number",
    "include you in any Marketing campaigns?",
    "Name of your Bank ?",
    "Cheque or Savings ?",
    "provide your account number ?",
    "it is compulsory that we request your bank statement on your behalf",
    "Can we kindly request the bank statement on your behalf?",
    "provide the information fully accurately and truthfully",
    "ensure you can afford the loan or credit limit you are applying for.",
    "Customer Name, your total living expenses are ... is this correct?",
    "Do you decalre the Income and Expenses provided is True and Correct ?",
    "Kindly note that this is a provisional offer valid for 5 working days.",
    "Credit Life Insurance Cover, which is underwritten by Guard Risk Life.  ",
    "It covers the outstanding balance of the loan in the event of your death and permanent disability.",
    "It covers 12 monthly instalments in the event of retrenchment, temporary disability, short time, compulsory unpaid leave.",
    "The waiting period on ALL benefits is 90 days from the day of disbursement.",
    "submit your own credit life insurance if you have one",
    "it is subject to African Bank Approval",
    "Will you be taking our credit life cover or will you be submitting your own ?",
    "Credit Life Insurance contains exclusions",
    "which will be explained in the documents that will be sent to you within 30 days",
    "information you provided is both true and correct, and can be used to determine whether you can afford the credit that you applied for?",
  ];

  // Initialize Deepgram client and set uncovered statements on component mount
  useEffect(() => {
    const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
    deepgramClientRef.current = deepgram; // Store the client in a ref

    // Initialize uncovered statements with all compliance statements
    setUncoveredStatements([...complianceStatements]);
  }, []);

  // Check if a compliance statement is covered in the transcript
  const checkComplianceStatements = (transcript) => {
    // Find new matches in the current transcript
    const newMatches = complianceStatements.filter((statement) => {
      // Skip statements that are already covered
      if (coveredStatements.includes(statement)) {
        return false;
      }

      const similarity = stringSimilarity.compareTwoStrings(
        transcript.toLowerCase(),
        statement.toLowerCase()
      );
      return similarity > 0.6; // Adjust the threshold as needed
    });

    if (newMatches.length > 0) {
      // Add new matches to the covered statements
      setCoveredStatements((prev) => {
        const updatedStatements = [...prev, ...newMatches];

        // Update the score based on all covered statements so far
        setScore(
          (updatedStatements.length / complianceStatements.length) * 100
        );

        return updatedStatements;
      });

      // Remove newly covered statements from uncovered list
      setUncoveredStatements((prev) =>
        prev.filter((statement) => !newMatches.includes(statement))
      );
    }
  };

  // Start recording and transcription
  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscript("");
      setCoveredStatements([]);
      setUncoveredStatements([...complianceStatements]);
      setScore(0);

      // Get user media (microphone access)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Create a Deepgram live connection using the initialized client
      const dgConnection = deepgramClientRef.current.listen.live({
        model: "nova-3", // Use the Nova model
        interim_results: true, // Get real-time partial results
        punctuate: true, // Add punctuation to the transcript
        redact: true,
      });

      // Handle Deepgram connection events
      dgConnection.on(LiveTranscriptionEvents.Open, () => {
        console.log("Deepgram connection opened");

        // Create a MediaRecorder to capture audio
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });

        // Send audio data to Deepgram
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            dgConnection.send(event.data);
          }
        };

        // Start recording audio
        mediaRecorder.start(2000); // Send data every 2 seconds
      });

      dgConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
        try {
          // Ensure the data structure is as expected
          if (
            data &&
            data.channel &&
            data.channel.alternatives &&
            data.channel.alternatives[0]
          ) {
            const newTranscript = data.channel.alternatives[0].transcript;

            if (newTranscript) {
              // Update the transcript state
              setTranscript((prev) => prev + " " + newTranscript);

              // Check compliance statements
              checkComplianceStatements(transcript + " " + newTranscript);
            }
          } else {
            console.error("Unexpected data structure:", data);
          }
        } catch (error) {
          console.error("Error processing transcript:", error);
        }
      });

      dgConnection.on(LiveTranscriptionEvents.Error, (error) => {
        console.error("Deepgram error:", error);
        stopRecording();
      });

      // Store the connection for cleanup
      deepgramClientRef.current.connection = dgConnection;
    } catch (error) {
      console.error("Error starting recording:", error);
      stopRecording();
    }
  };

  // Stop recording and cleanup
  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (deepgramClientRef.current.connection) {
      deepgramClientRef.current.connection.finish();
      deepgramClientRef.current.connection = null;
    }

    setIsRecording(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Live Transcription</h1>
      <div className="mb-4 flex gap-4">
        <button
          onClick={startRecording}
          disabled={isRecording}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </button>
        <button
          onClick={stopRecording}
          disabled={!isRecording}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Stop Recording
        </button>
      </div>

      <div className="mb-4 p-4 bg-gray-100 rounded max-h-40 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-2">Transcript:</h2>
        <p className="whitespace-pre-wrap">
          {transcript || "Start speaking to see the transcript..."}
        </p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Compliance Score:</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full"
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <p className="text-right mt-1">{score.toFixed(2)}%</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-4 rounded border border-green-200">
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            Covered Statements: ({coveredStatements.length})
          </h2>
          <ul className="list-disc pl-5 max-h-96 overflow-y-auto">
            {coveredStatements.map((statement, index) => (
              <li key={index} className="mb-1 text-green-800">
                {statement}
              </li>
            ))}
            {coveredStatements.length === 0 && (
              <p className="text-gray-500 italic">No statements covered yet</p>
            )}
          </ul>
        </div>

        <div className="bg-red-50 p-4 rounded border border-red-200">
          <h2 className="text-xl font-semibold mb-2 text-red-700">
            Uncovered Statements: ({uncoveredStatements.length})
          </h2>
          <ul className="list-disc pl-5 max-h-96 overflow-y-auto">
            {uncoveredStatements.map((statement, index) => (
              <li key={index} className="mb-1 text-red-800">
                {statement}
              </li>
            ))}
            {uncoveredStatements.length === 0 && (
              <p className="text-green-600 font-semibold">
                All statements covered!
              </p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VoiceToText;
