(function ($) {
    'use strict';

    function savePropertyValues($properties) {
        var values = {};

        $properties.find('.name_select_rielt').each(function () {
            var $property = $(this);
            var propertyId = $property.attr('data-property');
            var $checkboxes = $property.find('input[type="checkbox"]');
            var checked = [];

            $checkboxes.filter(':checked').each(function () {
                checked[checked.length] = $(this).siblings('.ckeck_param').attr('data-val');
            });

            values[propertyId] = {
                value: $property.find('input.ag_pole_good, select.ag_pole_good').first().val(),
                checked: checked
            };
        });

        return values;
    }

    function restorePropertyValues($properties, values) {
        $properties.find('.name_select_rielt').each(function () {
            var $property = $(this);
            var propertyId = $property.attr('data-property');
            var saved = values[propertyId];

            if (!saved) {
                return;
            }

            $property.find('input.ag_pole_good, select.ag_pole_good').first().val(saved.value);

            $property.find('input[type="checkbox"]').each(function () {
                var answerId = $(this).siblings('.ckeck_param').attr('data-val');
                $(this).prop('checked', $.inArray(answerId, saved.checked) !== -1);
            });
        });
    }

    function refreshProperties() {
        var category = [];
        var $properties = $('.property_all');
        var savedValues = savePropertyValues($properties);

        $('.category_checked').each(function () {
            category[category.length] = $(this).attr('data-category-id');
        });

        $properties.addClass('is-loading').attr('aria-busy', 'true');

        $.ajax({
            type: 'POST',
            url: './admin/ajax/property/Refresh_Property_Good.php',
            dataType: 'html',
            data: { 
                category: category
            },
            success: function (data) {
                if (data != 'no') {
                    $properties.html(data);
                    restorePropertyValues($properties, savedValues);
                }
            },
            error: function () {
                $properties.html('<div class="error-state">Не удалось обновить характеристики.</div>');
            },
            complete: function () {
                $properties.removeClass('is-loading').attr('aria-busy', 'false');
            }
        });
    }

    // Выбор категории в товаре и обновление блока характеристик.
    $('body').on('change', '.js-category', function () {
        $(this).closest('.add_good_name_category')
            .toggleClass('category_checked is-selected', this.checked);

        refreshProperties();
    });

    $('body').on('input', 'input[type="number"]', function () {
        if (this.value !== '' && Number(this.value) < 0) {
            this.value = '';
        }
    });

    // Обновление блока характеристик при загрузке страницы.
    $(refreshProperties);
}(jQuery));
