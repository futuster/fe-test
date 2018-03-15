<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    private $employees = [
        [
            'id' => 1,
            'name' => 'Константинопольский Константин Константинович',
            'gender' => 'м',
            'age' => 32,
            'position' => 'тестировщик',
        ],
        [
            'id' => 2,
            'name' => 'Иванов Пётр',
            'gender' => 'м',
            'age' => 54,
            'position' => 'системный администратор',
        ],
        [
            'id' => 3,
            'name' => 'Протопенко Светлана',
            'gender' => 'ж',
            'age' => 19,
            'position' => 'офис менеджер',
        ],
        [
            'id' => 5,
            'name' => 'Энди Вачовски',
            'gender' => '?',
            'age' => 50,
            'position' => 'режисер',
        ],
    ];

    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        return $this->render('default/index.html.twig');
    }

    /**
     * @Route("/api/employee", name="employee_api_list")
     */
    public function employeeApiAction()
    {
        return new JsonResponse($this->employees);
    }

    /**
     * @Route("/api/employee/store", name="employee_api_store")
     */
    public function employeeStoreApiAction(Request $request)
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
        } else {
            $data = $request->request->all();
        }

        if (isset($data['id']) && $data['id']) {
            $key = array_search($data['id'], $this->employees);
            $this->employees[$key] = $data;
            return new JsonResponse(['id' => $data['id']]);
        }
        $data['id'] = count($this->employees) + 1;
        array_push($this->employees, $data);
        return new JsonResponse(['id' => $data['id']]);
    }

}
