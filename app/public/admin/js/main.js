(function ($) {
    'use strict';

    function collectCategories() {
        var cats = [];

        $('.category_checked').each(function () {
            cats[cats.length] = $(this).attr('data-category-chpu');
        });

        return cats;
    }

    // Собирает значения свойств для проврочного payload.
    function collectPropertyValues() {
        var propertyMas = {};

        $('.name_select_rielt').each(function () {
            var $property = $(this);
            var propertyId = $property.attr('data-property');
            // Собираем ID отмеченных вариантов мультивыбора.
            var value = $property.find('input[type="checkbox"]:checked')
                .map(function () {
                    return $(this).siblings('.ckeck_param').attr('data-val');
                })
                .get()
                .join(':::');

            if (value === '') {
                // Берём значение обычного input или одиночного select.
                value = $property
                    .find('input.ag_pole_good, select.ag_pole_good')
                    .first()
                    .val();
            }

            if (value !== undefined && value !== '') {
                // Сохраняем только заполненные характеристики, включая 0.
                propertyMas[propertyId] = value;
            }
        });

        return propertyMas;
    }

    $('body').on('click', '.addgood_click', function () {
        var $button = $(this);

        $button.prop('disabled', true).text('Проверяем…');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/Preview_Good_Payload.php',
            dataType: 'json',
            data: {
                cats: collectCategories(),
                property_mas: collectPropertyValues()
            },
            success: function (data) {
                $('.js-payload-preview').text(JSON.stringify(data, null, 2));
            },
            error: function () {
                $('.js-payload-preview').text('Не удалось проверить отправку.');
            },
            complete: function () {
                $button.prop('disabled', false).text('Проверить отправку');
            }
        });
    });
}(jQuery));
