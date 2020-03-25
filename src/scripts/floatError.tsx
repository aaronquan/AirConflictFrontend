
function getError(err?:number){
    let error:number;
    if(err){
        error = err;
    }else{
        error = 0.000000001; // 1 * 10^-9
    }
    return error;
}

// less inclusive, error reduces value space
export function floatGT(value:number, compare:number, err?:number){
    let error:number = getError(err);
    return value > compare + error;
}

export function floatLT(value:number, compare:number,err?:number){
    let error:number = getError(err);
    return value < compare - error;
}

//more inclusive versions (error reduces)
export function floatGTInc(value:number, compare:number, err?:number){
    let error:number = getError(err);
    return value > compare - error;
}

export function floatLTInc(value:number, compare:number,err?:number){
    let error:number = getError(err);
    return value < compare + error;
}