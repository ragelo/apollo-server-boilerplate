import { GraphQLNonNull, GraphQLString } from 'graphql';
import {mutationWithClientMutationId} from 'graphql-relay';

import { BaseError } from '../../errors';
import { encodeAccessToken, encodeRefreshToken } from '../../middleware/auth/crypto';
import { getAuthClient } from '../../models/auth-client';
import { checkUserPassword } from '../../models/user';
import UserGQLType from '../types/user';

const LoginGQLMutation = mutationWithClientMutationId({
    name: 'Login',
    inputFields: {
        basicToken: {
            type: new GraphQLNonNull(GraphQLString),
        },
        username: {
            type: new GraphQLNonNull(GraphQLString),
        },
        password: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    outputFields: {
        accessToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (source) => source.accessToken,
        },
        expiresAt: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (source) => source.expiresAt,
        },
        refreshToken: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: (source) => source.refreshToken,
        },
        user: {
            type: new GraphQLNonNull(UserGQLType),
            resolve: (source) => source.user,
        }
    },
    async mutateAndGetPayload(args: any, context) {
        const clientId = await getAuthClientId(args.basicToken);

        if (!clientId) {
            throw new BaseError({
                error: {
                    code: 'InvalidBasicToken',
                },
                message: 'InvalidBasicToken',
            });
        }

        const user = await checkUserPassword(args.username, args.password);
    
        if (!user) {
            throw new BaseError({
                error: {
                    code: 'InvalidCredentials',
                },
                message: 'InvalidCredentials',
            });
        }

        const refreshToken = await encodeRefreshToken({user});
        const accessToken = encodeAccessToken({
            user, refreshTokenRef: refreshToken.id,
        }, clientId);

        return {
            accessToken: accessToken.token,
            expiresAt: new Date(accessToken.expires * 1000).getUTCDate(),
            refreshToken: refreshToken.token,
            user,
        };
    },
});
export default LoginGQLMutation;

/**
 * @returns Auth ClientID
 */
async function getAuthClientId(encodedBasicToken: string): Promise<string | null> {
    const basicToken = new Buffer(encodedBasicToken, 'base64').toString();
    const authClientInfo = basicToken.match(/^([^:]+):(.+)$/);
    if (!Array.isArray(authClientInfo)) {
        return null;
    }

    const [_, clientId, clientSecret] = authClientInfo;

    const client = await getAuthClient(clientId);

    if (client && client.secret === clientSecret) {
        return clientId;
    }

    return null;
}
