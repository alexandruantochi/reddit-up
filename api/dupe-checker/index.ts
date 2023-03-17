import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    if (!req.headers['content-length'] || parseInt(req.headers['Content-length']) > 10000 || !context.req.body) {
        context.res = {
            status: 403
        }
        return;
    }

    let dupeEtags = new Set();
    let dupeUrls: string[] = [];
    let requests: Promise<void>[] = [];
    let urlsToCheck: string[] = context.req.body.urls;

    for (let url of urlsToCheck) {
        requests.push(fetch(url, { method: 'HEAD' }).then(
            data => {
                let etag = data.headers.get("etag");
                if(etag){
                    if (dupeEtags.has(etag)) {
                        dupeUrls.push(url);
                    } else {
                        dupeEtags.add(etag);
                    }
                };
            },
            err => {
                console.error(err);
            }
        ));
    }

    await Promise.all(requests);

    context.res = {
        status: 200,
        body: dupeUrls,
        headers: { "Content-Type": "application/json" }
    }
};


export default httpTrigger;