import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

const endpoint = "https://celo.easscan.org/graphql";

function isEmpty(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0) ||
    (typeof value === "string" && value.trim().length === 0)
  );
}

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["attestations"],
    queryFn: () => {
      return axios({
        url: endpoint,
        method: "POST",
        data: {
          query: `{
          attestations(where: {attester:{equals:"0x00da1b2D16c777D8Be7656C6780d23a98292c0ee"}}) {
          
            id,
            attester,
            decodedDataJson,
            expirationTime,
            ipfsHash,
            isOffchain,
            recipient,
            refUID,
            revocable,
            revocationTime,
            revoked,
            schemaId,
            time,
            timeCreated,
            txid,
            schema {
              creator
            }
        
          }
        }`,
        },
      }).then((response) => {
        return response.data.data;
      });
    },
  });

  if (isLoading)
    return (
      <div className="text-5xl w-screen h-screen flex justify-center items-center text-[#2cce8a]">
        Loading...
      </div>
    );
  if (error) return <pre className="text-[#2cce8a]">{error.message}</pre>;

  return (
    <div className="pt-10">
      <p className="w-full text-center text-3xl text-[#2cce8a]">
        Gain Forest Attestation Data
      </p>
      <div className="w-full flex justify-center  mt-10">
        <div class="relative overflow-scroll w-[80%] h-[700px]">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="sticky top-0 z-10 text-xs uppercase bg-gray-50 dark:bg-gray-700 text-[#2cce8a]">
              <tr>
                <th scope="col" class="px-6 py-3">
                  UID
                </th>
                <th scope="col" class="px-6 py-3">
                  Schema
                </th>
                <th scope="col" class="px-6 py-3">
                  From
                </th>
                <th scope="col" class="px-6 py-3">
                  To
                </th>
                <th scope="col" class="px-6 py-3">
                  Type
                </th>
                <th scope="col" class="px-6 py-3">
                  Age
                </th>
                <th scope="col" class="px-6 py-3">
                  Message
                </th>
              </tr>
            </thead>
            <tbody>
              {!isEmpty(data?.attestations) &&
                data?.attestations.map((info, idx) => {
                  let tempArr = JSON.parse(info.decodedDataJson);
                  let messageObj = tempArr.find((e) => e.name === "message");

                  return (
                    <tr
                      class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={idx}
                    >
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        title={info?.id}
                      >
                        {info?.id}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {info?.schemaId}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {info?.attester}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {info?.recipient}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {info?.isOffchain ? "" : "ONCHAIN"}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {moment(
                          moment.unix(info?.timeCreated).format("lll")
                        ).fromNow(true)}
                      </th>
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {messageObj?.value?.value || "-"}
                      </th>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
