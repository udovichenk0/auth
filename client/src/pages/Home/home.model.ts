import {z} from "zod";
import {zodContract} from "@farfetched/zod";
import {baseQuery} from "@/shared/lib/base-query";
import {debug} from "patronum";
import {createEvent, sample} from "effector";
import {$sessionToken} from "@/entities/session";

const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
})
const userZodContract = zodContract(UserSchema)
// const getUser = createJsonQuery({
//     params: declareParams<{id: number, token: string | null}>(),
//     request: {
//         method: 'GET',
//         headers: ({token}) => ({'Authorization':`Bearer ${token}`}),
//         url:( {id}) => `http://localhost:3000/users/${id}`,
//     },
//     response: {
//         contract: userZodContract
//     }
// })
const userQuery = baseQuery({
    query: 'users',
    contract: userZodContract,
    params: {id: 1},
})
debug(userQuery.finished.failure)

export const getUserTriggered = createEvent<{id: number}>()
sample({
    clock: getUserTriggered,
    source: $sessionToken,
    fn: (token, {id}) => {
        return {
            token,
            id
        }
    },
    target: userQuery.start
})
debug(userQuery.$data)