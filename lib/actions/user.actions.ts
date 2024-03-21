"use server";

import { db } from "../db";
import { Language } from "@prisma/client"
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL!

const getLanguageEnum = (language: string) => {

    language = language.toLowerCase()

    if (language === "python") {
        return Language.PYTHON
    } else if (language === "c") {
        return Language.C
    } else if (language === "cpp") {
        return Language.CPP
    } else if (language === "java") {
        return Language.JAVA
    }

    return Language.JAVASCRIPT
}

export const createCodeSnippet = async ({
    source_code,
    username,
    description,
    language,
    input,
    token
}: {
    username: string,
    description: string,
    source_code: string,
    language: string,
    input: string;
    token: string;
}) => {
    try {
        const CodeSnippet = await db.codeuser.create({
            data: {
                username,
                description,
                input,
                token,
                source_code: source_code.trim(),
                language: getLanguageEnum(language)
            }
        })

        const client = createClient({
            url: REDIS_URL
        });

        client.on('error', err => console.log('Redis Client Error', err));

        await client.connect();

        const exists = await client.exists('codeSnippets')

        let CodeSnippets: string[] = []

        if (exists) {
            CodeSnippets = await client.lRange('codeSnippets', 0, -1)
        }

        await client.rPush('codeSnippets', [JSON.stringify(CodeSnippet), ...CodeSnippets])
        //after 2 min
        await client.expire('codeSnippets', 120)

        return CodeSnippet
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const getAllCodeSnippets = async () => {
    try {

        const client = createClient({
            url: REDIS_URL
        });

        client.on('error', err => console.log('Redis Client Error', err));

        await client.connect();

        const exists = await client.exists('codeSnippets')

        if (exists) {
            const getCodeSnippets = await client.lRange('codeSnippets', 0, -1)
            return getCodeSnippets.map((e) => JSON.parse(e))
        }

        const codeSnippets = await db.codeuser.findMany()

        await client.rPush('codeSnippets', codeSnippets.map((e) => JSON.stringify(e)))
        //after 2 min
        await client.expire('codeSnippets', 120)

        return codeSnippets
    } catch (error) {
        throw error
    }
}


export const getCodeSnippetById = async (id: string) => {
    try {
        const codeSnippet = await db.codeuser.findUnique({ where: { id } })

        if (!codeSnippet) throw new Error("Code Snippet Not Found")

        return codeSnippet
    } catch (error) {
        throw error
    }
}