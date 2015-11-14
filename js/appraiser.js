function populateItemInfo(data) {
  $("#item-info").show();
  $("#item-name").text(data.item.name);

  $("#item-weapon-damage").text(data.item.weapon_damage);
  $("#weapon-damage-min").text(data.weapon.damage_die_rolls_min + "D" + data.weapon.damage_die_sides_min);
  $("#weapon-damage-max").text(data.weapon.damage_die_rolls_max + "D" + data.weapon.damage_die_sides_max);
  var itemDamage = data.item.damage_die_rolls * data.item.damage_die_sides;
  var minDamage = data.weapon.damage_die_rolls_min * data.weapon.damage_die_sides_min;
  var maxDamage = data.weapon.damage_die_rolls_max * data.weapon.damage_die_sides_max;
  $("#item-weapon-damage-rating").data("value", calculateRating(itemDamage, minDamage, maxDamage));

  $("#item-critical-chance").text(data.item.critical_chance + "%");
  $("#critical-chance-min").text(data.weapon.critical_chance_min + "%");
  $("#critical-chance-max").text(data.weapon.critical_chance_max + "%");
  $("#item-critical-chance-rating").data("value", calculateRating(data.item.critical_chance, data.weapon.critical_chance_min, data.weapon.critical_chance_max));

  $("#item-critical-multiplier").text(data.item.critical_multiplier + "x");
  $("#critical-multiplier-min").text(data.weapon.critical_multiplier_min + "x");
  $("#critical-multiplier-max").text(data.weapon.critical_multiplier_max + "x");
  $("#item-critical-multiplier-rating").data("value", calculateRating(data.item.critical_multiplier, data.weapon.critical_multiplier_min, data.weapon.critical_multiplier_max));

  $("#item-block-chance").text(data.item.block_chance + "%");
  $("#block-chance-min").text(data.weapon.block_chance_min + "%");
  $("#block-chance-max").text(data.weapon.block_chance_max + "%");
  $("#item-block-chance-rating").data("value", calculateRating(data.item.block_chance, data.weapon.block_chance_min, data.weapon.block_chance_max));

  $(".item-rating").each(function () {
    var rating = $(this).data("value");
    $(this).find(".meter").css("width", rating + "%");
    $(this).find(".rating").text(rating + "/100");
  });
}

function calculateRating(actual, min, max) {
  if (max == min) return 100;
  return parseInt((actual - min) * 100 / (max - min));
}

function parseWeapon(input) {
  var item = {
    name: input.match("^([A-Za-z ]+)[\r\n]")[1],
    weapon_damage: input.match("Weapon damage: ([D0-9]+)[ \t\r\n\f]")[1],
    damage_die_rolls: parseInt(input.match("Weapon damage: ([0-9]+)D[0-9]+[ \t\r\n\f]")[1]),
    damage_die_sides: parseInt(input.match("Weapon damage: [0-9]+D([0-9]+)[ \t\r\n\f]")[1]),
    critical_chance: parseFloat(input.match("Critical hit chance: ([0-9\.]+)%[ \t\r\n\f]")[1]),
    critical_multiplier: parseFloat(input.match("Critical hit multiplier: ([0-9\.]+)x[ \t\r\n\f]")[1]),
    damage_type: input.match("Damage Type: ([A-Za-z]+)[ \t\r\n\f]")[1],
    block_chance: parseInt(input.match("Block chance: ([0-9]+)%[ \t\r\n\f]")[1]),
    block_bludgeoning_text: input.match("Block bludgeoning: ([A-Za-z]+)[ \t\r\n\f]")[1],
    block_piercing_text: input.match("Block piercing: ([A-Za-z]+)[ \t\r\n\f]")[1],
    block_slashing_text: input.match("Block slashing: ([A-Za-z]+)[ \t\r\n\f]")[1],
    weight: parseInt(input.match("Weight: ([0-9]+)g[ \t\r\n\f]")[1]),
    space: parseInt(input.match("Space: ([0-9]+)cc[ \t\r\n\f]")[1]),
    current_durability: parseInt(input.match("Durability: ([0-9]+)/([0-9]+)[ \t\r\n\f]*")[1]),
    durability: parseInt(input.match("Durability: ([0-9]+)/([0-9]+)[ \t\r\n\f]*")[2])
  };
  return item;
}

$("#lookup").click(function () {
  var item = parseWeapon($("#paste").val());
  var xhr = $.get("data/weapons.json");
  xhr.done(function (weapons) {
    var weapon = {};
    weapons.forEach(function (w) {
      if (w.name === item.name) {
        weapon = w;
        return;
      }
    })
    data = { item: item, weapon: weapon };
    populateItemInfo(data);
  });
});
