"use server";

import axios, { AxiosError } from "axios";

const options: any = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    params: {
        base64_encoded: 'false',
        wait: 'true',
        fields: '*'
    },
    headers: {
        'content-type': 'application/json',
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.JUDGE_API!,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
    },
    data: {
        language_id: 54,
        source_code: "",
        stdin: null
    }
};


export const RunCode = async (language_id: number, source_code: string, stdin?: string | null) => {
    try {

        if (!source_code || !language_id) {
            throw new Error("Source is required")
        }

        options.data.language_id = language_id
        options.data.source_code = source_code

        if (stdin) {
            options.data.stdin = stdin
        }

        const response = await axios.request(options);



        if (response.data && response.data.status.id === 3) {
            return {
                success: "Run Successfully",
                stdout: response.data.stdout,
                time: response.data.time,
                token: response.data.token,
            }
        } else {
            return {
                error: "Something went wrong : ",
                status: response.data.status.id === 11 ? 'Runtime Error (NZEC)' : "Compilation Error",
                stderr: response.data.stderr
            }
        }
    } catch (error) {

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 400) {
                throw new Error("Check the Programming Language! or Your Program is in loop")
            }
        }

        throw error
    }
}