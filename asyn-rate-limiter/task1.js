const urls=Array.from({length: 20},(_, index)=>`/api/user/${index+1}`);
console.log("API URLs:",urls);
console.log("Total URLs:",urls.length);

function fakeRequest(url) {
    const delay=Math.floor(Math.random()*401)+100;
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(Math.random()<0.2){
                reject(new Error(`Request failed for${url}`));
            }
            else{
                resolve({
                    message:"Request successful",
                    userId:Number(url.split("/").pop()),
                    fetchedAt:new Date().toISOString()
                });
            }
        },delay);
});
}

// fakeRequest("/api/user/1")
// .then(data=>console.log("Success:",data))
// .catch(error=>console.log("Error:",error.message));

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
}

async function rateLimitedFetch(
    urls,
    concurrency=5,
    retries=2
){
    if(!Number.isInteger(concurrency)||concurrency<=1){
        throw new Error("Concurrancy must be a positive integer.");
    }
    if(!Number.isInteger(retries)||retries<0){
        throw new Error("Retries must be a non-negative integer.");
    }
    const results=new Array(urls.length);
    let nextIndex=0;
    let completed=0;

    async function worker(){
        while(true){
            const index=nextIndex++;
            if(index>=urls.length){
                return;
            }
            const url=urls[index];

            let attempts=0;
            let data;
            let status="failed";

            while(attempts<retries+1){
                attempts++;

                try{
                    data =await fakeRequest(url);
                    status ="success";
                    break;
                }
                catch(error){
                    console.log(`[Retry] ${url}, attempt ${attempts}: ${error.message}`);

                    if(attempts<retries+1){
                        const backoff=200+2**(attempts-1);
                        console.log(`[Wait] ${url}: ${backoff}ms`);
                        await sleep(backoff);
                    }
                }
            }
        
            results[index]={
                url,
                status,
                data:data??null,
                attempts
            };

            completed++;

            console.log(
                `[Progress] ${completed}/${urls.length} completed | `+
                `${url} | ${status} | attempts: ${attempts}`
            );
        }
    }

    const workerCount=Math.min(concurrency, urls.length);

    await Promise.all(
        Array.from(
            {length:workerCount},
            ()=>worker()
        )
    );
    return results;
}

async function main(){
    console.log("Starting rate-limited API requests...\n");

    const results=await rateLimitedFetch(urls, 5, 2);
    console.log("\n================Final Results================");

    console.table(
        results.map(({url, status, attempts})=>({
            url,
            status,
            attempts
        }))
    );
    const successful=results.filter(
        result=>result.status==="success"
    ).length;

    console.log(`Susccessfull: ${successful}`);
    console.log(`Failed: ${results.leength - successful}`);
}

main().catch(console.error);