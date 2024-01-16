let greekLetters = ["alpha", "beta", "gamma", "delta", "epsilon", "theta", "iota", "kappa", "lambda", "mu", "nu", "pi", "rho", "sigma", "tau", "phi", "psi", "omega"];

export const parseEquations = (equationString) => {

    function parseOne(match) {
        let equation_1 = match;
        equation_1 = equation_1.replace('[', "");
        equation_1 = equation_1.replace(']', "");
        equation_1 = equation_1.replace("torch.", "");
        equation_1 = equation_1.replace("np.", "");

        let e = []
        let open = 0;
        let close = 0;
        let startIndex = 0;
        let stopIndex = 0;
        for (var i = 0; i < equation_1.length; i++) {
            if (equation_1[i] == "(") {
                open += 1;
            }
            else if (equation_1[i] == ")") {
                close += 1;
            }

            else if (equation_1[i] == "+" || equation_1[i] == "-") {
                if (open == close) {
                    stopIndex = i - 1;
                    e.push(equation_1.substring(startIndex, stopIndex).trim());
                    startIndex = i + 1;
                    e.push(equation_1[i]);
                }
            }
        }

        e.push(equation_1.substring(startIndex, equation_1.length).trim());

        // Find the independent variable
        let independent_varibles = []
        for (let i of e) {
            let s = i.search("diff");
            let j = i.substring(s);
            if (j.substring(0, 4) == "diff") {
                let n = j.split(',')
                // console.log(n);
                if (n.length == 2) {
                    independent_varibles.push(i[i.length - 2]);
                }
                else if (n.length == 3) {
                    independent_varibles.push(n[1][n[1].length - 1]);
                }

            }
        }

        independent_varibles = independent_varibles.filter((item, i, ar) => ar.indexOf(item) === i);

        // Find if ordinary(0) or partial(1)
        let opde = independent_varibles.length > 1 ? 1 : 0;

        // Find the dependent variable
        for (let i of e) {
            let s = i.search("diff");
            let j = i.substring(s);
            if (j.substring(0, 4) == "diff") {
                let dependent_variable = j[5];
                break;
            }
        }

        let tex = "";
        if (opde == 1) {
            for (let i of e) {
                let s = i.search("diff");
                if (s != -1) {
                    let a = i.substring(0, s);
                    let j = i.substring(s);
                    a = a.replace(/\*\*/g, "^");
                    a = a.replace(/\*/g, "");
                    tex += a;

                    j = j.replace(/\*\*/g, "^");
                    j = j.replace(/\*/g, "");
                    let t = j.slice(5, i.length);
                    let n = t.split(', ');
                    if (n.length == 3) {
                        let o = n[2][n[2].length - 2];
                        tex += "\\frac{\\partial^" + o + "(" + n[0] + ")}{\\partial " + n[1] + "^" + o + "}";
                    }
                    else {

                        tex += "\\frac{\\partial (" + n[0] + ")}{\\partial " + n[1][0] + "}";
                    }
                }

                else {
                    i = i.replace(/\*\*/g, "^");
                    i = i.replace(/\*/g, "");
                    tex += i;
                }
            }
        }

        else if (opde == 0) {
            for (let i of e) {

                let s = i.search("diff");
                if (s != -1) {
                    let a = i.substring(0, s);
                    let j = i.substring(s);
                    a = a.replace(/\*\*/g, "^");
                    a = a.replace(/\*/g, "");
                    tex += a;

                    j = j.replace(/\*\*/g, "^");
                    j = j.replace(/\*/g, "");
                    let t = j.slice(5, i.length);
                    let n = t.split(',');
                    console.log(n);
                    if (n.length == 3) {
                        let o = n[2].replace(/[^0-9]/g, '');
                        tex += "\\frac{d^" + o + "(" + n[0] + ")}{d " + n[1] + "^" + o + "}";
                    }
                    else {

                        tex += "\\frac{d (" + n[0] + ")}{d " + n[1].trim()[0] + "}";
                    }
                }

                else {
                    i = i.replace(/\*\*/g, "^");
                    i = i.replace(/\*/g, "");
                    tex += i;
                }
            }
        }
        tex += " = 0";
        return tex;
    }

    function parseString(string) {
        let e = []
        let open = 0;
        let close = 0;
        let startIndex = 0;
        let stopIndex = 0;
        // let oneExample = true;
        string = string.replace('[', "");
        string = string.replace(']', "");
        for (var i = 0; i < string.length; i++) {
            if (string[i] == "(") {
                open += 1;
            }
            else if (string[i] == ")") {
                close += 1;
            }
            else if (string[i] == ",") {
                if (open == close) {
                    stopIndex = i;
                    e.push(string.substring(startIndex, stopIndex).trim());
                    startIndex = i + 1;
                }
            }
        }
        if (string.substring(startIndex, string.length).trim() != '') {
            e.push(string.substring(startIndex, string.length).trim())
        }

        return e;
    }


    // Find the equations part
    let pattern = /\[.*\]/;
    let matches = equationString.match(pattern);
    console.log(matches);

    let equations = parseString(matches[0]);
    console.log(equations);

    pattern = /\[(.*?)\]/g;
    let parsedEquations = [];

    for (let eq of equations) {
        //let pe = parseOne(eq.match(pattern)[0]);
        let pe = parseOne(eq);
        for (var g = 0; g < greekLetters.length; g++) {
            pe = pe.replaceAll(greekLetters[g], "\\" + greekLetters[g] + " ");
        }

        console.log(pe);
        if (pe != ":N_FUNCTIONS+N_COORDSeq_params = tuple(variablesidx = 0") {
            parsedEquations.push(pe);
        }
    }

    return parsedEquations;

}

export const parseConditions = (conditions, dependentVariables, independentVariables) => {
    console.log("====================== conditions ================");
    console.log(conditions);
    console.log(dependentVariables);
    console.log(independentVariables);
    let parsedConditions = [];
    let cond_1, cond_2, cond_3, cond_4;

    if (conditions !== undefined && dependentVariables !== undefined && independentVariables !== undefined) {
        for (var i = 0; i < conditions.length; i++) {
            if (conditions[i]["condition_type"] == "DirichletBVP2D") {
                cond_1 = conditions[i]["f0"];
                cond_2 = conditions[i]["f1"];
                cond_3 = conditions[i]["g0"];
                cond_4 = conditions[i]["g1"];

                cond_1 = cond_1.split(',');
                let xMin = cond_1[0][cond_1[0].length - 1];
                let cond_1_arg = cond_1[1].split(':')[1].trim();
                cond_1_arg = cond_1_arg.replace("torch.", "");
                cond_1_arg = cond_1_arg.replace("np.", "");
                cond_1 = dependentVariables[0] + "(" + xMin + ", " + independentVariables[1] + ") = " + cond_1_arg;
                console.log(cond_1);

                cond_2 = cond_2.split(',');
                let xMax = cond_2[0][cond_2[0].length - 1];
                let cond_2_arg = cond_2[1].split(':')[1].trim();
                cond_2_arg = cond_2_arg.replace("torch.", "");
                cond_2_arg = cond_2_arg.replace("np.", "");
                cond_2 = dependentVariables[0] + "(" + xMax + ", " + independentVariables[1] + ") = " + cond_2_arg;
                console.log(cond_2);

                cond_3 = cond_3.split(',');
                let yMin = cond_3[0][cond_3[0].length - 1];
                let cond_3_arg = cond_3[1].split(':')[1].trim();
                cond_3_arg = cond_3_arg.replace("torch.", "");
                cond_3_arg = cond_3_arg.replace("np.", "");
                cond_3 = dependentVariables[0] + "(" + independentVariables[0] + ", " + yMin + ") = " + cond_3_arg;
                console.log(cond_3);

                cond_4 = cond_4.split(',');
                let yMax = cond_4[0][cond_4[0].length - 1];
                let cond_4_arg = cond_4[1].split(':')[1].trim();
                cond_4_arg = cond_4_arg.replace("torch.", "");
                cond_4_arg = cond_4_arg.replace("np.", "");
                cond_4 = dependentVariables[0] + "(" + independentVariables[0] + ", " + yMax + ") = " + cond_4_arg;
                console.log(cond_4);

                parsedConditions.push(cond_1);
                parsedConditions.push(cond_2);
                parsedConditions.push(cond_3);
                parsedConditions.push(cond_4);
            }

            else if (conditions[i]["condition_type"] == "IVP") {

                if (dependentVariables.length > 1) {
                    if (conditions[i]["u_0"] != null) {
                        parsedConditions.push(dependentVariables[i] + "(" + conditions[i]["t_0"] + ") = " + conditions[i]["u_0"]);
                    }

                    if (conditions[i]["u_0_prime"] != null) {
                        parsedConditions.push("\\frac{d(" + dependentVariables[i] + ")}{" + independentVariables[0] + "}(" + conditions[i]["t_0"] + ") = " + conditions[i]["u_0_prime"]);
                    }
                }

                else {
                    if (conditions[i]["u_0"] != null) {
                        parsedConditions.push(dependentVariables[0] + "(" + conditions[i]["t_0"] + ") = " + conditions[i]["u_0"]);
                    }

                    if (conditions[i]["u_0_prime"] != null) {
                        parsedConditions.push("\\frac{d(" + dependentVariables[0] + ")}{" + independentVariables[0] + "}(" + conditions[i]["t_0"] + ") = " + conditions[i]["u_0_prime"]);
                    }
                }
            }
        }

        for (var i = 0; i < parsedConditions.length; i++) {
            parsedConditions[i] = parsedConditions[i].replace(/\*\*/g, "^");
            parsedConditions[i] = parsedConditions[i].replace(/\*/g, "");
            for (var g = 0; g < greekLetters.length; g++) {
                parsedConditions[i] = parsedConditions[i].replaceAll(greekLetters[g], "\\" + greekLetters[g] + " ");
            }
        }

        console.log(parsedConditions);
    }

    return parsedConditions;
}

// Example from solution
// lambda u, v, t : [ diff(u, t) - (alpha*u  - beta*u*v),diff(v, t) - (delta*u*v - gamma*v), ]
// =>
// [ diff(u, t) - (alpha*u  - beta*u*v),diff(v, t) - (delta*u*v - gamma*v), ]
// => 
// diff(u, t) - (alpha*u  - beta*u*v)
// diff(v, t) - (delta*u*v - gamma*v)

// For testing
// let q = [];

// q.push("[diff(p, t) + diff(p*(a*x - b*x**3) + 2, x) - (s**2/2)*diff(p, x, order=2)]");
// q.push("[diff(u, t, order=2) + torch.sin(u)]");
// q.push("[diff(u, t) - u*(1-u)]");
// q.push("[diff(x, t) + beta*t]");
// q.push("[- (1/2)*(sigma**2)*diff(p, x, order=2) + diff((a*x-b*x**3)*p , x)]")

// parseEquations(q);

