// src/lib/server/oauth.js
'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { OAuthProvider } from 'node-appwrite';

import { createAdminClient } from './appwrite';

/**
 * JC-34: This file is adapted from Appwrite OAuth authentication with SSR:
 * @see {@link https://appwrite.io/docs/tutorials/nextjs-ssr-auth/step-7#oauth-server-action}
 */

export async function signUpWithGithub() {
    const { account } = await createAdminClient();

    const origin = (await headers()).get('origin');

    const redirectUrl = await account.createOAuth2Token(OAuthProvider.Github, `${origin}/oauth`, `${origin}/sign-up`);

    return redirect(redirectUrl);
};

export async function signUpWithGoogle() {
    const { account } = await createAdminClient();

    const origin = (await headers()).get('origin');

    const redirectUrl = await account.createOAuth2Token(OAuthProvider.Google, `${origin}/oauth`, `${origin}/sign-up`);

    return redirect(redirectUrl);
};