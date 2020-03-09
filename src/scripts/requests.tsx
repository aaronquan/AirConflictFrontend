import axios, {AxiosResponse} from 'axios';

export function singleRequest(url:string, callback:((r:AxiosResponse<any>, params?:any) => any), getOptions?:any, callbackParams?:any){
    axios.get(url, getOptions).then(res => {
        callback(res, callbackParams);
    })
    .catch(res => {
        console.log(res.data);
    });
}

export function requestChain(url:string, callback:((r:AxiosResponse<any>, params?:any) => any), getOptions?:any, callbackParams?:any){
    axios.get(url, getOptions).then(res => {
        if(res.data.next != null){
            requestChain(res.data.next, callback);
        }
        callback(res, callbackParams);
    })
    .catch(res => {
        console.log(res.data);
    });
}

export function requestAllPages(url:string, callback:((r:AxiosResponse<any>, params?:any) => any), getOptions?:any, callbackParams?:any){
    if(getOptions){
        axios.get(url, getOptions).then(res => {
            if('total_pages' in res.data){
                let npages:number = res.data.total_pages;
                let otherPages:Promise<AxiosResponse<any>>[] = []; 
                for (let i=2; i<=npages; i++){
                    let newOptions = Object.assign({}, getOptions);
                    let newParams = Object.assign({page: i}, getOptions.params);
                    newOptions.params = newParams;
                    console.log(newOptions);
                    otherPages.push(axios.get(url, newOptions));
                }
                axios.all(otherPages)
                .then(axios.spread((...responses) => {
                    for (let i = 0; i < responses.length; i++) {
                        callback(responses[i], callbackParams);
                    }
                }));
            }
            callback(res, callbackParams);
        });
    }else{
        axios.get(url).then(res => {
            if('total_pages' in res.data){
                let npages:number = res.data.total_pages;
                let otherPages:Promise<AxiosResponse<any>>[] = []; 
                for (let i=2; i<=npages; i++){
                    let newOptions = {params: {page: i}};
                    otherPages.push(axios.get(url, newOptions));
                }
                axios.all(otherPages)
                .then(axios.spread((...responses) => {
                    for (let i = 0; i < responses.length; i++) {
                        callback(responses[i], callbackParams);
                    }
                }));
            }
            callback(res, callbackParams);
        });    
    }
}