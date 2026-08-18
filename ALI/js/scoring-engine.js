// ============================================================
// ALI 1.0
// Scoring Engine
// ============================================================


// ============================================================
// ① ALI 基本設定
// ============================================================




// ============================================================
// ② 限制數值範圍
// ============================================================

function clamp(value, min, max) {

    return Math.min(
        Math.max(value, min),
        max
    );

}


// ============================================================
// ③ 計算單項能力
// ============================================================
//
// L = 能力極限
// D = 目前能力
// S = 穩定度
//
// ALI_i =
// (L + D) × (0.7 + 0.003S)
//

function calculateAbilityScore(answer) {

    const L = clamp(
        Number(answer.L),
        0,
        100
    );

    const D = clamp(
        Number(answer.D),
        0,
        100
    );

    const S = clamp(
        Number(answer.S),
        0,
        100
    );


    const score =
        (L + D) *
        (
            ALI_CONFIG.STABILITY_BASE +
            ALI_CONFIG.STABILITY_WEIGHT *
            (S / 100)
        );


    return clamp(
        score,
        ALI_CONFIG.MIN_SCORE,
        ALI_CONFIG.MAX_SCORE
    );

}


// ============================================================
// ④ 計算 32 項能力
// ============================================================

function calculateAllAbilityScores(answers) {

    return answers.map(
        answer =>
            calculateAbilityScore(answer)
    );

}


// ============================================================
// ⑤ 計算 8 大領域
// ============================================================

function calculateDomainScores(
    abilityScores,
    domains
) {

    const result = [];


    domains.forEach(
        (domain, domainIndex) => {

            const start =
                domainIndex *
                ALI_CONFIG.ABILITIES_PER_DOMAIN;


            const end =
                start +
                ALI_CONFIG.ABILITIES_PER_DOMAIN;


            const scores =
                abilityScores.slice(
                    start,
                    end
                );


            const total =
                scores.reduce(
                    (sum, score) =>
                        sum + score,
                    0
                );


            const average =
                total /
                ALI_CONFIG.ABILITIES_PER_DOMAIN;


            result.push({

                id: domain.id,

                name: domain.name,

                scores: scores,

                score: average

            });

        }
    );


    return result;

}


// ============================================================
// ⑥ Base Score
// ============================================================

function calculateBaseScore(domainScores) {

    const total =
        domainScores.reduce(
            (sum, domain) =>
                sum + domain.score,
            0
        );


    return (
        total /
        ALI_CONFIG.DOMAIN_COUNT
    );

}


// ============================================================
// ⑦ Breadth Index
// ============================================================

function calculateBreadthIndex(domainScores) {

    const ratios =
        domainScores.map(
            domain =>
                Math.min(
                    domain.score /
                    ALI_CONFIG.STANDARD_SCORE,
                    1
                )
        );


    const total =
        ratios.reduce(
            (sum, ratio) =>
                sum + ratio,
            0
        );


    return (
        total /
        ALI_CONFIG.DOMAIN_COUNT
    );

}


// ============================================================
// ⑧ Breadth Bonus
// ============================================================

function calculateBreadthBonus(breadthIndex) {

    const bonus =
        ALI_CONFIG.BREADTH_MULTIPLIER *
        (
            breadthIndex -
            ALI_CONFIG.BREADTH_CENTER
        );


    return clamp(
        bonus,
        -ALI_CONFIG.BREADTH_MAX_BONUS,
        ALI_CONFIG.BREADTH_MAX_BONUS
    );

}


// ============================================================
// ⑨ Final ALI
// ============================================================

function calculateFinalALI(
    baseScore,
    breadthBonus
) {

    return clamp(
        baseScore +
        breadthBonus,
        ALI_CONFIG.MIN_SCORE,
        ALI_CONFIG.MAX_SCORE
    );

}


// ============================================================
// ⑩ 完整 ALI 計算
// ============================================================

function calculateALI(
    answers,
    domains
) {

    // 32 項能力

    const abilityScores =
        calculateAllAbilityScores(
            answers
        );


    // 8 大領域

    const domainScores =
        calculateDomainScores(
            abilityScores,
            domains
        );


    // Base Score

    const baseScore =
        calculateBaseScore(
            domainScores
        );


    // Breadth Index

    const breadthIndex =
        calculateBreadthIndex(
            domainScores
        );


    // Breadth Bonus

    const breadthBonus =
        calculateBreadthBonus(
            breadthIndex
        );


    // Final ALI

    const finalALI =
        calculateFinalALI(
            baseScore,
            breadthBonus
        );


    return {

        abilityScores,

        domainScores,

        baseScore,

        breadthIndex,

        breadthBonus,

        finalALI

    };

}


// ============================================================
// ⑪ ALI 等級
// ============================================================

function getALILevel(score) {

    if (score < 50) {

        return {

            name: "LOW",

            description:
                "目前能力結構低於 ALI 基準範圍。"

        };

    }


    if (score < 80) {

        return {

            name: "BELOW STANDARD",

            description:
                "目前能力結構明顯低於基準。"

        };

    }


    if (score < 100) {

        return {

            name: "NEAR STANDARD",

            description:
                "目前能力結構接近 ALI 基準。"

        };

    }


    if (score < 120) {

        return {

            name: "STANDARD",

            description:
                "整體能力結構位於 ALI 標準範圍。"

        };

    }


    if (score < 140) {

        return {

            name: "HIGH",

            description:
                "整體能力結構高於 ALI 基準。"

        };

    }


    if (score < 160) {

        return {

            name: "EXCEPTIONAL",

            description:
                "整體能力結構達到卓越範圍。"

        };

    }


    if (score < 180) {

        return {

            name: "EXTREME",

            description:
                "整體能力結構處於極高範圍。"

        };

    }


    return {

        name: "LIMIT",

        description:
            "整體能力結構接近 ALI 系統上限。"

    };

}