const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const LANGUAGE_CONFIGS = {
    javascript: { extension: "js", command: "node" },
    python: { extension: "py", command: "python3" },
    java: { extension: "java", command: "javac", run: "java", mainFile: "Main" },
    cpp: { extension: "cpp", command: "g++", run: "./main" },
    c: { extension: "c", command: "gcc", run: "./main" }  // ✅ Added C language
};


const executeCode = (language, code) => {
    return new Promise((resolve, reject) => {
        const langConfig = LANGUAGE_CONFIGS[language];
        if (!langConfig) return reject("Unsupported language");

        const folderPath = path.join(__dirname, "..", "code");
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        const fileName = langConfig.mainFile ? `${langConfig.mainFile}.${langConfig.extension}` : `script.${langConfig.extension}`;
        const filePath = path.join(folderPath, fileName);

        fs.writeFileSync(filePath, code);

        let compileProcess = null;

        if (language === "java") {
            // Compile Java file
            compileProcess = spawn(langConfig.command, [filePath], { cwd: folderPath });
        }else if (language === "cpp" || language === "c") {
            compileProcess = spawn(langConfig.command, [filePath, "-o", "main"], { cwd: folderPath });
        }


        if (compileProcess) {
            compileProcess.on("close", (code) => {
                if (code !== 0) return reject("Compilation failed.");
                runCode(langConfig.run || langConfig.command, filePath, resolve, reject, folderPath);
            });
        } else {
            // Run directly for JS & Python
            runCode(langConfig.command, filePath, resolve, reject, folderPath);
        }
    });
};

const runCode = (command, filePath, resolve, reject, cwd) => {
    const process = spawn(command, [filePath], { cwd });

    let output = "";
    let error = "";

    process.stdout.on("data", (data) => {
        output += data.toString();
    });

    process.stderr.on("data", (data) => {
        error += data.toString();
    });

    process.on("close", () => {
        fs.unlinkSync(filePath); // Cleanup file
        if (error) reject(error.trim());
        else resolve(output.trim());
    });
};

// Controller for API requests
const executeCodeController = async (req, res) => {
    const { language, code } = req.body;
    console.log("Executing code for language:", language);

    try {
        const output = await executeCode(language, code);
        res.json({ output });
    } catch (error) {
        res.status(400).json({ output: error });
    }
};

module.exports = { executeCodeController };
