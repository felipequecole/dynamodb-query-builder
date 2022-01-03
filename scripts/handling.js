$(document).ready(function () {
    populateRegions();
    persist();
    reinitilizeForm(1);
});


$('#addParam').on("click", function () {
    queryCount = getCount() + 1;
    var query = $('#query');
    query.append(buildQuery(queryCount))
    $('#removeParam').removeClass('disabled');
    setCount(queryCount);
    reinitilizeForm(queryCount);
});


$('#removeParam').on("click", function () {
    console.log('remove');
    let queryCount = getCount();
    if (queryCount > 1) {
        let queryToBeRemoved = `query#${queryCount}`;
        console.warn(`Removing ${queryToBeRemoved}`);
        document.getElementById(queryToBeRemoved).remove();
        queryCount = queryCount - 1;
        setCount(queryCount);
        reinitilizeForm(queryCount);
    } else {
        console.warn("You need at least one query parameter");
        alert("You need at least one query parameter");
    }

    if (queryCount == 1) {
        $('#removeParam').addClass('disabled');
    }
});

function populateRegions() {
    let options = regions.map(region => buildOption(region));
    let regionSelect = $('#region');
    regionSelect.append(options);
}

function buildQuery(id) {
    return `
    <div id='query#${id}'>
      <div class="three fields">
        <div class="field">
          <label>Field</label>
          <div class="field">
            <input type="text" name="field#${id}" placeholder="Field Name" />
          </div>
        </div>
        <div class="field">
          <label>Type</label>
          <select name="dataType#${id}" id="dataType#${id}" class="ui fluid dropdown">
            <option value="">Data Type</option>
            <option value="S">String</option>
            <option value="N">Number</option>l
            <option value="BOOL">Boolean</option>
            <option value="B">Byte</option>
            <option value="S">Date (ISO-8601)</option>
          </select>
        </div>

        <div class="field">
          <label>Value</label>
          <div class="field">
            <input type="text" name="value#${id}" placeholder="First Name" />
          </div>
        </div>
      </div>
    </div>
    `
}

function getFieldsValidation(count) {

    var fields = {
        'tableName': 'empty',
    }

    for (let i = 1; i <= count; i++) {
        fields[`field#${i}`] = 'empty'
        fields[`value#${i}`] = 'empty'
        fields[`dataType#${i}`] = 'empty'
    }

    return fields;

}

function reinitilizeForm(count) {

    return $(".ui.form").form(
        {
            fields: getFieldsValidation(count),
            onSuccess: function (event, fields) {
                event.preventDefault();
                let result = generateQuery(fields);
                $('#result').val(result);
                return false;
            },
        }
    );
}

function getCount() {
    return parseInt($('#queryCount').val());
}

function setCount(val) {
    $('#queryCount').val(val);
}

function persist() {
    try {
        let form = document.getElementById("form");
        FormPersistence.persist(form);
    } catch (e) {
        console.warn(`Cannot use persister, you are probably using Incognito Mode. ${e.message}`);
    }
}

function buildOption(region) {
    console.log(region);
    let regionName = region['Region Name'];
    let regionCode = region['Code'];
    return `<option value="${regionCode}">${regionName}</option>`
}
