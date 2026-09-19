<?php

require_once dirname(dirname(dirname(dirname(__DIR__)))) . '/src/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

// Упрощённая обезличенная копия реального legacy-обработчика.
function property($property)
{
    $place = '';
    if ($property['place_prop'] != '') {
        $place = '<div class="field-help">' . htmlspecialchars($property['place_prop'], ENT_QUOTES, 'UTF-8') . '</div>';
    }

    $idProp = $property['id'];
    $allOption = '';

    if ($property['type_prop'] == '1') {
        $result = '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . htmlspecialchars($property['name_prop'], ENT_QUOTES, 'UTF-8') . '</div>
            ' . $place . '
            <input type="text" class="text-input add-inp ag_pole_good" placeholder="' . htmlspecialchars($property['name_prop'], ENT_QUOTES, 'UTF-8') . '">
        </div>';
    } elseif ($property['type_prop'] == '2') {
        $answers = db()->query(
            "SELECT * FROM property_answer_s WHERE id_prop = '" . $idProp . "' ORDER BY sort_answer"
        );

        while ($answer = $answers->fetch()) {
            $allOption .= '<option value="' . $answer['id'] . '">' . htmlspecialchars($answer['answer_prop'], ENT_QUOTES, 'UTF-8') . '</option>';
        }

        $result = '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . htmlspecialchars($property['name_prop'], ENT_QUOTES, 'UTF-8') . '</div>
            ' . $place . '
            <select class="text-input ag_pole_good">
                <option value="">Не выбрано</option>' . $allOption . '
            </select>
        </div>';
    } elseif ($property['type_prop'] == '3') {
        $answers = db()->query(
            "SELECT * FROM property_answer_s WHERE id_prop = '" . $idProp . "' ORDER BY sort_answer"
        );
        $checkboxes = '';

        while ($answer = $answers->fetch()) {
            $checkboxes .= '<label class="choice line_chek">
                <input type="checkbox">
                <span class="ckeck_param" data-val="' . $answer['id'] . '">' . htmlspecialchars($answer['answer_prop'], ENT_QUOTES, 'UTF-8') . '</span>
            </label>';
        }

        $result = '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . htmlspecialchars($property['name_prop'], ENT_QUOTES, 'UTF-8') . '</div>
            ' . $place . '
            <div class="choice-grid checkbox_property ag_pole_good">' . $checkboxes . '</div>
        </div>';
    } elseif ($property['type_prop'] == '4') {
        $result = '<div class="property-field name_select_rielt" data-property="' . $idProp . '" data-property-id="' . $idProp . '">
            <div class="field-label name">' . htmlspecialchars($property['name_prop'], ENT_QUOTES, 'UTF-8') . '</div>
            ' . $place . '
            <input type="number" class="text-input add-inp ag_pole_good" min="0" placeholder="' . htmlspecialchars($property['name_prop'], ENT_QUOTES, 'UTF-8') . '">
        </div>';
    } else {
        $result = '';
    }

    return $result;
}

// Получить запрос для выбора свойств
function createQuery(array $categories)
{
    $query = "SELECT * FROM property_s WHERE cat_prop = ''";
    
    if (!empty($categories)) {
        foreach ($categories as $categoryId) {
            $categoryId = (int) $categoryId;
            if ($categoryId > 0) {
                $query .= " OR FIND_IN_SET(" . $categoryId . ", cat_prop) > 0";
            }
        }
    }

    $query .= " ORDER BY sort_prop";

    return $query;
}

$category = isset($_POST['category']) && is_array($_POST['category']) 
    ? $_POST['category'] 
    : array();

$result = '';

$properties = db()->query(createQuery($category));

while ($property = $properties->fetch()) {
    $result .= property($property);
}

echo $result === '' ? 'no' : $result;
