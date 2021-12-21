function generateQuery(input) {
    parsed = parseInputs(input);
    return cliQuery(parsed);
}

function cliQuery(inputs) {
    let attrs = expressionAttributes(inputs['query']);
    let tableName = inputs['tableName'];
    let keyConditionExpression = attrs['keyConditionExpression'];
    let expressionAttributeValues = attrs['expressionAttributeValues'];
    expressionAttributeValues = expressionAttributeValues.replace(/"/g, '\\"')
    let region = inputs['region']
    let output = `aws dynamodb query --table-name ${tableName}`;
    if (region !== "") {
        output += ` --region ${region}`
    }

    output += ` --key-condition-expression "${keyConditionExpression}"`;
    output += ` --expression-attribute-values "${expressionAttributeValues}"`

    return output

}

function expressionAttributes(queries) {
    let keyConditionExpression = ""
    let mappingValues = {}
    for (var id in queries) {
        query = queries[id];
        let field = query['field'];
        let dataType = query['type'];
        let value = query['value'];
        if (keyConditionExpression !== "") {
            keyConditionExpression += " and "
        }
        let valuePlaceHolder = `:v${id}`
        keyConditionExpression += `${field} = ${valuePlaceHolder}`
        mappingValues[valuePlaceHolder] = {}
        mappingValues[valuePlaceHolder][dataType] = value
    }

    return {
        'keyConditionExpression': keyConditionExpression,
        'expressionAttributeValues': JSON.stringify(mappingValues)
    }
}

function parseInputs(input) {
    const fieldRegex = /field#(?<index>\d+)/;
    const valueRegex = /value#(?<index>\d+)/;
    const typeRegex = /dataType#(?<index>\d+)/;
    let parsedInput = {
        'query': {}
    }
    for (var e in input) {
        if (e === 'tableName') {
            parsedInput[e] = input[e]
        } else if (fieldRegex.test(e)) {
            let match = fieldRegex.exec(e);
            let index = `${match.groups.index}`;
            if (parsedInput['query'][index] !== undefined) {
                parsedInput['query'][`${index}`]['field'] = input[e];
            } else {
                parsedInput['query'][`${index}`] = { 'field': input[e] };
            }

        } else if (valueRegex.test(e)) {
            let match = valueRegex.exec(e);
            let index = match.groups.index;
            if (parsedInput['query'][index] !== undefined) {
                parsedInput['query'][`${index}`]['value'] = input[e];
            } else {
                parsedInput['query'][`${index}`] = { 'value': input[e] };
            }
        } else if (typeRegex.test(e)) {
            let match = typeRegex.exec(e);
            let index = match.groups.index;
            if (parsedInput['query'][index] !== undefined) {
                parsedInput['query'][`${index}`]['type'] = input[e];
            } else {
                parsedInput['query'][`${index}`] = { 'type': input[e] };
            }
        } else {
            parsedInput[e] = input[e]
        }
    }
    return parsedInput;
}

